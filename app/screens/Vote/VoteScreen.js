import React, { useState, useEffect } from 'react';
import { SafeAreaView, TouchableOpacity, View, FlatList } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { get } from 'lodash';

import styles from './VoteScreen.style';
import { KHeader, KButton, KText } from '../../components';
import { connectAccounts } from '../../redux';
import { getProducers, getAccount, sumAmount } from '../../eos/eos';
import { getChain } from '../../eos/chains';
import ProducerListItem from './components/ProducerListItem';
import { PRIMARY_BLUE } from '../../theme/colors';
import { log } from '../../logger/logger';

const VoteScreen = props => {
  const {
    navigation: { goBack },
    route: {
      params: { account },
    },
  } = props;

  const [producers, setProducers] = useState([]);
  const [totalProducerVoteWeight, setTotalProducerVoteWeight] = useState(1);
  const [votedProducers, setVotedProducers] = useState([]);
  const [isVoting, setVoting] = useState(false);
  // const [liquidBalance, setLiquidBalance] = useState('0.0000');
  // const [refundingBalance, setRefundingBalance] = useState('0.0000');
  const [totalStaked, setTotalStaked] = useState('0.0000');

  useEffect(() => {
    const fetchProducers = async () => {
      if (!account) {
        return;
      }

      const chain = getChain(account.chainName);
      if (!chain) {
        return;
      }

      try {
        const res = await getProducers(chain);
        setProducers(res.rows);
        setTotalProducerVoteWeight(res.total_producer_vote_weight);

        const accountInfo = await getAccount(account.accountName, chain);
        const vProducers = get(accountInfo, 'voter_info.producers', []);
        setVotedProducers(vProducers);
        // setLiquidBalance(accountInfo.core_liquid_balance.split(' ')[0]);
        if (accountInfo.self_delegated_bandwidth) {
          setTotalStaked(
            sumAmount(
              accountInfo.self_delegated_bandwidth.cpu_weight,
              accountInfo.self_delegated_bandwidth.net_weight,
            ),
          );
        }

        // if (accountInfo.refund_request) {
        //   setRefundingBalance(
        //     sumAmount(
        //       accountInfo.refund_request.cpu_amount,
        //       accountInfo.refund_request.net_amount,
        //     ),
        //   );
        // }
      } catch (err) {
        log({
          description: 'get producers failed with error',
          cause: err,
          location: 'VoteScreen',
        });
      }
    };
    fetchProducers();
  }, [account]);

  const _handleChangeVote = item => {
    let res = [];

    if (votedProducers.includes(item.owner)) {
      res = votedProducers.filter(value => value !== item.owner);
    } else {
      res = votedProducers.concat(item.owner);
    }

    setVotedProducers(res);
  };

  const _handleVote = async () => {
    if (!account) {
      return;
    }

    const chain = getChain(account.chainName);
    if (!chain) {
      return;
    }

    setVoting(true);
    try {
      // const sortedVps = votedProducers.slice().sort();
      // const res = await voteProducers(sortedVps, activeAccount, chain);
    } catch (err) {
      log({
        description: 'vote failed with error',
        cause: err,
        location: 'VoteScreen',
      });
    }
    setVoting(false);
  };

  const getSubtitle = () => {
    return account.chainName + ' ' + account.accountName;
  };

  const getTitle = () => {
    return 'Vote for ' + account.chainName + ' Block Producers';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <MaterialIcon
            name={'keyboard-backspace'}
            size={24}
            color={PRIMARY_BLUE}
          />
        </TouchableOpacity>
        <KHeader
          title={getTitle()}
          subTitle={getSubtitle()}
          style={styles.header}
        />
        <KText>Total voted for {votedProducers.length} producers</KText>
        <KText>Total staked: {totalStaked}</KText>
        <FlatList
          style={styles.list}
          data={producers}
          renderItem={({ item, index }) => (
            <ProducerListItem
              data={item}
              percentage={(
                (100.0 * item.total_votes) /
                totalProducerVoteWeight
              ).toPrecision(4)}
              isVoted={votedProducers.includes(item.owner)}
              onChangeVote={_handleChangeVote}
              rank={index + 1}
            />
          )}
          keyExtractor={(item, index) => `${index}`}
        />
        <KButton
          title={'Confirm Votes'}
          theme={'blue'}
          style={styles.button}
          icon={'check'}
          onPress={_handleVote}
          isLoading={isVoting}
        />
      </View>
    </SafeAreaView>
  );
};

export default connectAccounts()(VoteScreen);
