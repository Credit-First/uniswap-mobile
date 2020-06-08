import React, { useState } from 'react';
import { SafeAreaView, View, TouchableOpacity, Dimensions } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { PieChart, ProgressChart } from "react-native-chart-kit";
import { KHeader, KText } from '../../components';
import styles from './AccountDetailsScreen.style';
import { connectAccounts } from '../../redux';
import { getAccount } from '../../eos/eos';
import { getChain } from '../../eos/chains';
import { PRIMARY_BLUE } from '../../theme/colors';


const AccountDetailsScreen = props => {
  const [liquidBalance, setLiquidBalance] = useState();
  const [totalBalance, setTotalBalance] = useState();
  const [refundBalance, setRefundBalance] = useState();
  const [cpuStaked, setCpuStaked] = useState();
  const [netStaked, setNetStaked] = useState();
  const [liquidNumber, setLiquidNumber] = useState(0);
  const [refundNumber, setRefundNumber] = useState(0);
  const [cpuStakedNumber, setCpuStakedNumber] = useState(0);
  const [netStakedNumber, setNetStakedNumber] = useState(0);
  const [ramUsed, setRamUsed] = useState();
  const [ramQuota, setRamQuota] = useState();
  const [netUsagePct, setNetUsagePct] = useState(0);
  const [cpuUsagePct, setCpuUsagePct] = useState(0);
  const [ramUsagePct, setRamUsagePct] = useState(0);

  const {
    navigation: { navigate, goBack },
    route: {
      params: { action },
    },
    accountsState: { accounts }
  } = props;

  const account = accounts[action];
  // Stake chart data:
  const stakeData = [
  {
    name: "Liquid",
    balance: liquidNumber,
    color: "rgba(42, 254, 106, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 12
  },
  {
    name: "Refund",
    balance: refundNumber,
    color: "rgba(254, 142, 42, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 12
  },
  {
    name: "CPU",
    balance: cpuStakedNumber,
    color: "rgba(205, 227, 255, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 12
  },
  {
    name: "NET",
    balance: netStakedNumber,
    color: "rgb(113, 175, 255)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 12
  }
];
  // Resource Chart data:
  const resourceData = {
    labels: ["NET", "CPU", "RAM"], 
    data: [netUsagePct, cpuUsagePct, ramUsagePct]
  };
  // Common charts config:
  const screenWidth = Dimensions.get("window").width;
  const chartConfig = {
      backgroundColor: "#FFFFFF",
      backgroundGradientFrom: "#FFFFFF",
      backgroundGradientTo: "#FFFFFF",
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
  };

  const loadAccount = async (account) => {
    const chain = getChain(account.chainName);
    const accountInfo = await getAccount(account.accountName, chain);
    var token = accountInfo.core_liquid_balance.split(' ')[1];
    const selfUnstaked = parseFloat(accountInfo.core_liquid_balance.split(' ')[0]);
    const selfCpuStaked = parseFloat(accountInfo.self_delegated_bandwidth.cpu_weight.split(' ')[0]);
    const selfNetStaked = parseFloat(accountInfo.self_delegated_bandwidth.net_weight.split(' ')[0]);
    var refund = accountInfo.refund_request;
    var totRefund = 0;
    if (refund) {
      var cpuRefund = parseFloat(refund.cpu_amount.split(' ')[0]);
      var netRefund = parseFloat(refund.net_amount.split(' ')[0]);
      var totRefund = cpuRefund + netRefund;
      setRefundNumber(totRefund);
    } 
    var total = (selfUnstaked + selfCpuStaked + selfNetStaked + totRefund).toFixed(4);
    setTotalBalance(total + ' ' + token);
    setLiquidBalance(accountInfo.core_liquid_balance);
    setRefundBalance(totRefund + ' ' + token);
    setLiquidNumber(selfUnstaked);
    setCpuStakedNumber(selfCpuStaked);
    setNetStakedNumber(selfNetStaked);
    setCpuStaked(accountInfo.total_resources.cpu_weight);
    setNetStaked(accountInfo.total_resources.net_weight);
    setRamUsed(accountInfo.ram_usage);
    setRamQuota(accountInfo.ram_quota);
    setRamUsagePct(accountInfo.ram_usage/accountInfo.ram_quota);
    setCpuUsagePct(accountInfo.cpu_limit.used/accountInfo.cpu_limit.available);
    setNetUsagePct(accountInfo.net_limit.used/accountInfo.net_limit.available);
  };

  loadAccount(account);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContentContainer}
        enableOnAndroid>
          <View style={styles.inner}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <MaterialIcon
              name={'keyboard-backspace'}
              size={24}
              color={PRIMARY_BLUE}
            />
            </TouchableOpacity>
            <KHeader
              title={account.accountName}
              subTitle={account.chainName}
              style={styles.header}
            />
            <View style={styles.spacer} />
            <KText>Available: {liquidBalance}</KText>
            <KText>Total balance: {totalBalance}</KText>
            <KText>Refund balance: {refundBalance}</KText>
            <KText>CPU Staked: {cpuStaked}</KText>
            <KText>NET Staked: {netStaked}</KText>
            <KText>RAM Used/Quota: {ramUsed}/{ramQuota} bytes</KText>
            <View style={styles.spacer} />
            <KText>Staked vs liquid balances: </KText>
            <PieChart
              data={stakeData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              accessor="balance"
              backgroundColor="transparent"
              absolute
            />
            <View style={styles.spacer} />
            <KText>Resources usage: </KText>
            <ProgressChart
              data={resourceData}
              width={screenWidth}
              height={220}
              strokeWidth={16}
              radius={32}
              chartConfig={chartConfig}
              hideLegend={false}
            />
          </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default connectAccounts()(AccountDetailsScreen);
