import * as React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { KeyboardAvoidingView, Platform } from 'react-native';

import Button from '../../../components/Trade/Button';
import Divider from '../../../components/Trade/Divider';
import { ICON_NAMES } from '../../../components/Trade/Icons';
import ModalBottom from '../../../components/Trade/ModalBottom';
import ModalConfirmTransaction from '../../../components/Trade/ModalConfirmTransaction';
import ModalDeposit from '../../../components/Trade/ModalDeposit';
import ModalLoading from '../../../components/Trade/ModalLoading';
import NavigationBar from '../../../components/Trade/NavigationBar';
import PullToRefresh from '../../../components/Trade/PullToRefresh';
import { Text, View } from '../../../components/Trade/Themed';
import TransactionSummary from '../../../components/Trade/TransactionSummary';
import { useTrade } from '../../../contexts/TradeContext';
import { useWallet } from '../../../contexts/Wallet/WalletContext';
import { Coin, CoinBalance } from '../../../contexts/Wallet/WalletHelpers';
import { waitForModal } from '../../../helpers/helpers';
import { feeWithCurrency, numberFormatter } from '../../../helpers/wallet';
import useThemedStyles from '../../../hooks/useThemedStyles';
import { useNavigation } from '../../../../navigation/helpers';
import ROUTES from '../../../../navigation/routes';
import TradeCoinInput from '../../components/TradeCoinInput';
import TradeSetting from '../../components/TradeSetting';
import TradeTokenSelectPanel from '../../components/TradeTokenSelectPanel';
import stylesMain from './styles';

const textLoading = 'pullToRefresh.reloadBalance.text';

const TradeMainScreen = ({ route }) => {
  const styles = useThemedStyles(stylesMain);
  const navigation = useNavigation();
  const balance = route.params?.balance;
  const { getAmountsOut, getAmountsIn, swap } = useTrade();
  const {
    walletBalance,
    reloadBalance,
    fee,
    getCoinBalances,
    balanceReloading,
  } = useWallet();

  const [
    tradeFromAvailableToken,
    setTradeFromAvailableToken,
  ] = React.useState();
  const [tradeToAvailableToken, setTradeToAvailableToken] = React.useState();

  const [isVisibleModalTradeFrom, setIsVisibleModalTradeFrom] = React.useState(
    false,
  );
  const [isVisibleModalTradeTo, setIsVisibleModalTradeTo] = React.useState(
    false,
  );
  const [isVisibleModalDeposit, setIsVisibleModalDeposit] = React.useState(
    false,
  );
  const [
    isVisibleConfirmationModal,
    setIsVisibleConfirmationModal,
  ] = React.useState(false);
  const [isVisibleModalSetting, setIsVisibleModalSetting] = React.useState(
    false,
  );
  const [isVisibleError, setIsVisibleError] = React.useState(true);
  const [estimatedField, setEstimatedField] = React.useState('to');
  const [isLoading, setIsLoading] = React.useState(false);
  const [disableButton, setDisableButton] = React.useState(false);

  const minLimitations = {
    bnb: 0.001,
    igu: 1,
    igup: 1,
  };

  const estimatedTransactionFee = React.useMemo(() => {
    switch (tradeFromAvailableToken?.name) {
      case Coin.bnb:
        return fee?.transferCoin.bnb;
      case Coin.igu:
        return fee?.transferCoin.igu;
      case Coin.igup:
        return fee?.transferCoin.igup;
    }
  }, [tradeFromAvailableToken, fee]);

  const isBNBEnough = React.useMemo(() => {
    return Number(walletBalance?.bnb.value) >= Number(estimatedTransactionFee);
  }, [walletBalance, estimatedTransactionFee]);

  const validationSchemaDefault = Yup.object({
    to: Yup.string().required('isRequired'),
  });

  const baseSchema = Yup.string().required('isRequired');

  const bnbSchema = Yup.object({
    from: baseSchema
      .test('maxAmount', 'maxAmountError', value => {
        return (
          Number(value) <=
          Number(tradeFromAvailableToken?.value) -
            Number(estimatedTransactionFee)
        );
      })
      .test(
        'minLimit',
        'minLimitError',
        value => Number(value) >= minLimitations.bnb,
      ),
  });

  const iguSchema = Yup.object({
    from: baseSchema
      .test(
        'maxAmount',
        'maxAmountError',
        value => Number(value) <= Number(tradeFromAvailableToken?.value),
      )
      .test('bnbNotEnough', 'bnbNotEnough', () => isBNBEnough)
      .test(
        'minLimit',
        'minLimitError',
        value => Number(value) >= minLimitations.igu,
      ),
  });

  const validSchema = {
    BNB: bnbSchema,
    IGU: iguSchema,
    IGUP: iguSchema,
  };

  const validationSchema = React.useMemo(() => {
    return validationSchemaDefault.concat(
      validSchema[(tradeFromAvailableToken?.name)],
    );
  }, [tradeFromAvailableToken?.name, validSchema]);

  const formikData = useFormik({
    initialValues: {
      from: '0.0',
      to: '0.0',
    },
    validationSchema,
    onSubmit: values => handleConfirmTradeModal(),
    enableReinitialize: true,
  });

  const {
    submitForm,
    values,
    errors,
    setFieldValue,
    isValid,
    dirty,
  } = formikData;

  React.useEffect(() => {
    if (walletBalance && balance) {
      setTradeFromAvailableToken(balance);
      if (balance.name === 'BNB') {
        setTradeToAvailableToken(walletBalance.igu);
      } else {
        setTradeToAvailableToken(walletBalance.bnb);
      }
    } else if (walletBalance && !balance) {
      setTradeFromAvailableToken(walletBalance?.bnb);
      setTradeToAvailableToken(walletBalance?.igu);
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    reloadBalance(false);
  }, []);

  const handleCloseModalTradeFrom = () => {
    setIsVisibleModalTradeFrom(false);
  };

  const handleOnTradeFromPress = () => {
    setIsVisibleModalTradeFrom(true);
  };

  const handleCloseModalTradeTo = () => {
    setIsVisibleModalTradeTo(false);
  };

  const handleOnTradeToPress = () => {
    setIsVisibleModalTradeTo(true);
  };

  const handleOnDepositPress = () => {
    setIsVisibleModalDeposit(true);
  };

  const onPressAvailable = async () => {
    if (tradeFromAvailableToken?.name === 'BNB')
      handleTradeFrom(
        numberFormatter(
          (
            Number(tradeFromAvailableToken?.value) -
            Number(estimatedTransactionFee)
          ).toString(),
        ),
      );
    else {
      handleTradeFrom(numberFormatter(tradeFromAvailableToken?.value ?? '0'));
    }
  };

  const handleTokenPairs = async (coinPurpose, coin) => {
    let tradeFrom = tradeFromAvailableToken;
    let tradeTo = tradeToAvailableToken;
    if (coinPurpose === 'from') {
      if (coin.name === tradeToAvailableToken?.name) {
        setTradeToAvailableToken(tradeFromAvailableToken);
        tradeTo = tradeFromAvailableToken;
      }
      setTradeFromAvailableToken(coin);
      tradeFrom = coin;
    } else if (coinPurpose === 'to') {
      if (coin.name === tradeFromAvailableToken?.name) {
        setTradeFromAvailableToken(tradeToAvailableToken);
        tradeFrom = tradeToAvailableToken;
      }
      setTradeToAvailableToken(coin);
      tradeTo = coin;
    }

    if (estimatedField === 'from') {
      handleTradeTo(values.to, tradeFrom, tradeTo);
    } else {
      handleTradeFrom(values.from, tradeFrom, tradeTo);
    }
  };

  const convertToNumber = text => {
    const amount = (text.match(/([0-9]*[.])?[0-9]*/g) || ['0'])[0];
    const pointIndex = amount.indexOf('.');
    let convertedValue;
    if (pointIndex < 0) {
      convertedValue = isNaN(parseFloat(amount))
        ? ''
        : parseFloat(amount).toString();
    } else if (pointIndex === 0) {
      convertedValue = '0' + amount;
    } else {
      const intStr = amount.slice(0, pointIndex);
      convertedValue =
        parseFloat(intStr).toString() +
        '.' +
        amount.slice(pointIndex + 1, pointIndex + 5);
    }
    return convertedValue;
  };

  const handleTradeFrom = async (text, tradeFrom, tradeTo) => {
    const numStr = convertToNumber(text);
    const fromToken = tradeFrom ?? tradeFromAvailableToken;
    const toToken = tradeTo ?? tradeToAvailableToken;
    setEstimatedField('to');
    await setFieldValue('from', numStr);

    const value = Number(numStr);
    let amountsOut = '0';
    if (value !== 0.0 && fromToken?.name && toToken?.name) {
      amountsOut = await getAmountsOut(fromToken?.name, toToken?.name, value);
    }
    await setFieldValue('to', numberFormatter(amountsOut));
  };

  const handleTradeTo = async (text, tradeFrom, tradeTo) => {
    const numStr = convertToNumber(text);
    const fromToken = tradeFrom ?? tradeFromAvailableToken;
    const toToken = tradeTo ?? tradeToAvailableToken;
    await setFieldValue('to', numStr);
    setEstimatedField('from');

    const value = Number(numStr);
    let amountsIn = '0';
    if (value !== 0.0 && fromToken?.name && toToken?.name) {
      amountsIn = await getAmountsIn(fromToken?.name, toToken?.name, value);
    }

    if (amountsIn === 'transaction') {
      await setFieldValue('from', '0.0');
      await setFieldValue('to', '0.0');
    } else await setFieldValue('from', numberFormatter(amountsIn));
  };

  const handleTokenFromOutChange = async () => {
    const tempInToken = tradeFromAvailableToken;
    const tempOutToken = tradeToAvailableToken;
    setTradeFromAvailableToken(tempOutToken);
    setTradeToAvailableToken(tempInToken);

    setIsVisibleError(false);

    if (estimatedField === 'from') {
      await setFieldValue('to', '');
      await handleTradeFrom(values.to, tempOutToken, tempInToken);
    } else {
      await setFieldValue('from', '');
      await handleTradeTo(values.from, tempOutToken, tempInToken);
    }

    setIsVisibleError(true);
  };

  const handleConfirmTradeModal = () => {
    setIsVisibleConfirmationModal(true);
  };

  const handleOpenSettings = () => {
    setIsVisibleModalSetting(true);
  };

  const handleCloseSetting = () => {
    setIsVisibleModalSetting(false);
  };

  const handleTrade = React.useCallback(async () => {
    if (tradeFromAvailableToken?.name && tradeToAvailableToken?.name) {
      setDisableButton(true);
      setIsLoading(true);
      const result = await swap(
        tradeFromAvailableToken?.name,
        tradeToAvailableToken?.name,
        estimatedField === 'from' ? 'to' : 'from',
        estimatedField === 'from' ? values.to : values.from,
      );
      setDisableButton(false);
      setIsLoading(false);
      waitForModal().then(() => {
        navigation.navigate(ROUTES.WALLET_TRADE_SUCCESS, {
          estimate: estimatedField,
          from: values.from + ' ' + tradeFromAvailableToken.name,
          to: values.to + ' ' + tradeToAvailableToken.name,
          fee: feeWithCurrency(estimatedTransactionFee),
          totalSummary: values.from + ' ' + tradeFromAvailableToken.name,
          explorerUrl: result,
          balance: tradeToAvailableToken,
        });
      });
    }
  }, [
    swap,
    estimatedField,
    values.from,
    values.to,
    tradeFromAvailableToken?.name,
    tradeToAvailableToken?.name,
    estimatedTransactionFee,
    setIsLoading,
    setDisableButton,
    estimatedTransactionFee,
  ]);

  const renderItem = React.useCallback(() => {
    return (
      <>
        <View style={styles.mainContent}>
          <TradeCoinInput
            type="from"
            isEstimated={estimatedField === 'from'}
            amount={values.from}
            error={!!errors.from && isVisibleError}
            token={tradeFromAvailableToken}
            onChangeText={handleTradeFrom}
            onPressAvailableLabel={onPressAvailable}
            onPressSwapItem={handleOnTradeFromPress}
          />
          {isVisibleError && errors.from && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errors.from}</Text>
            </View>
          )}
          {isVisibleError && errors.from === 'maxAmountError' && (
            <View style={styles.newDeposit}>
              <Button
                onPress={handleOnDepositPress}
                type="text"
                style={styles.depositButtonStyle}
                iconName={ICON_NAMES.PLUS_GREEN}
                title="deposit"
              />
            </View>
          )}
          <View style={styles.tradeButtonContainer}>
            <Button
              onPress={handleTokenFromOutChange}
              type={'outline'}
              iconName={ICON_NAMES.GREEN_TRADE}
              style={styles.tradeButton}
            />
          </View>
          <TradeCoinInput
            type="to"
            isEstimated={estimatedField === 'to'}
            amount={values.to}
            token={tradeToAvailableToken}
            onChangeText={handleTradeTo}
            onPressAvailableLabel={onPressAvailable}
            onPressSwapItem={handleOnTradeToPress}
          />
        </View>
      </>
    );
  }, [
    tradeFromAvailableToken,
    tradeToAvailableToken,
    values,
    errors,
    isVisibleError,
    estimatedField,
  ]);

  const renderConfirmModal = () => {
    const transactionDetailsValues = [
      {
        key: 'transaction',
        value: 'confirmTrade',
      },
      {
        key: 'estimate',
        value: `${numberFormatter(values.from ?? '')} ${
          tradeFromAvailableToken?.name
        }`,
      },
      {
        key: 'trade.checkout.to',
        value: `${numberFormatter(values.to ?? '')} ${
          tradeToAvailableToken?.name
        }`,
      },
      {
        key: 'checkout.fields.fee',
        value: feeWithCurrency(estimatedTransactionFee),
      },

      {
        key: 'checkout.fields.totalSummary',
        value: `${values.from} ${tradeFromAvailableToken?.name}`,
      },
    ];

    return (
      <>
        <ModalConfirmTransaction
          isVisible={isVisibleConfirmationModal}
          setIsVisible={setIsVisibleConfirmationModal}
          TransactionDetailsComponent={
            <TransactionSummary values={transactionDetailsValues} />
          }
          onConfirm={handleTrade}
        />
      </>
    );
  };

  const renderDepositModal = () => {
    return (
      <ModalDeposit
        isVisible={isVisibleModalDeposit}
        setIsVisible={setIsVisibleModalDeposit}
        coin={tradeFromAvailableToken?.name}
      />
    );
  };

  const renderSettingsModal = () => {
    return (
      <ModalBottom
        visible={isVisibleModalSetting}
        titleText="trade.settings"
        modalHeight={50}
        onClose={handleCloseSetting}
        avoidKeyboard={true}>
        <TradeSetting handleClose={handleCloseSetting} />
      </ModalBottom>
    );
  };

  const renderLoadingModal = React.useCallback(() => {
    return <ModalLoading visibility={isLoading} text="trade.processingTrade" />;
  }, [isLoading]);

  const renderTradeTokenModals = () => {
    return (
      <>
        <ModalBottom
          visible={isVisibleModalTradeFrom}
          titleText="trade.selectToken"
          modalHeight={'500px'}
          onClose={handleCloseModalTradeFrom}>
          <TradeTokenSelectPanel
            handleClose={handleCloseModalTradeFrom}
            selectCoin={handleTokenPairs}
            coinPurpose="from"
            balance={getCoinBalances()}
          />
        </ModalBottom>
        <ModalBottom
          visible={isVisibleModalTradeTo}
          titleText="trade.selectToken"
          modalHeight={'500px'}
          onClose={handleCloseModalTradeTo}>
          <TradeTokenSelectPanel
            handleClose={handleCloseModalTradeTo}
            selectCoin={handleTokenPairs}
            coinPurpose="to"
            balance={getCoinBalances()}
          />
        </ModalBottom>
      </>
    );
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <NavigationBar
          backIcon={'leftArrow'}
          filled={false}
          settingsIcon
          containerStyle={styles.containerStyle}
          title="wallet.trade"
          onPressSettings={handleOpenSettings}
        />

        <View style={styles.flex}>
          <PullToRefresh
            refreshing={balanceReloading}
            textLoading={textLoading}
            onRefresh={() => onRefresh()}
            renderItem={renderItem}
          />
          <Divider customStyles={styles.divider} />
          <View style={styles.feePanel}>
            <TransactionSummary
              values={[
                {
                  key: 'checkout.fields.fee',
                  value: feeWithCurrency(estimatedTransactionFee),
                },
                {
                  key: 'checkout.fields.totalSummary',
                  value: `${numberFormatter(values.from)} ${
                    tradeFromAvailableToken?.name
                  }`,
                },
              ]}
            />
          </View>
          <Button
            disabled={
              !(isValid && dirty) || Number(values?.from) === 0 || disableButton
            }
            title="'wallet.trade"
            containerStyle={styles.button}
            onPress={submitForm}
          />
          {renderConfirmModal()}
          {renderTradeTokenModals()}
          {renderDepositModal()}
          {renderSettingsModal()}
          {renderLoadingModal()}
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default TradeMainScreen;
