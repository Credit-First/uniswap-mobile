import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList } from 'react-native';
import { get } from 'lodash';

import styles from './VoteScreen.style';
import { KHeader, KButton } from '../../components';
import { connectAccounts } from '../../redux';
import {
  getProducers,
  getAccount,
  voteProducers,
  sumAmount,
} from '../../eos/eos';
import { supportedChains } from '../../eos/chains';
import ProducerListItem from './components/ProducerListItem';
import BalanceItem from './components/BalanceItem';

const VoteScreen = props => {
  const {
    accountsState: { accounts, activeAccountIndex },
  } = props;

  const [producers, setProducers] = useState([]);
  const [totalProducerVoteWeight, setTotalProducerVoteWeight] = useState(1);
  const [votedProducers, setVotedProducers] = useState([]);
  const [isVoting, setVoting] = useState(false);
  const [liquidBalance, setLiquidBalance] = useState('0.0000');
  const [refundingBalance, setRefundingBalance] = useState('0.0000');
  const [totalStaked, setTotalStaked] = useState('0.0000');

  useEffect(() => {
    const fetchProducers = async () => {
      const activeAccount = accounts[activeAccountIndex];
      if (!activeAccount) {
        return;
      }

      const chain = supportedChains.find(
        item => item.name === activeAccount.chainName,
      );
      if (!chain) {
        return;
      }

      try {
        const res = await getProducers(chain);
        setProducers(res.rows);
        setTotalProducerVoteWeight(res.total_producer_vote_weight);

        const account = await getAccount(activeAccount.accountName, chain);
        console.log(account);
        const vProducers = get(account, 'voter_info.producers', []);
        setVotedProducers(vProducers);
        setLiquidBalance(account.core_liquid_balance.split(' ')[0]);
        if (account.self_delegated_bandwidth) {
          setTotalStaked(
            sumAmount(
              account.self_delegated_bandwidth.cpu_weight,
              account.self_delegated_bandwidth.net_weight,
            ),
          );
        }

        if (account.refund_request) {
          setRefundingBalance(
            sumAmount(
              account.refund_request.cpu_amount,
              account.refund_request.net_amount,
            ),
          );
        }
      } catch (e) {
        console.log('get producers failed with error: ', e);
      }
    };

    fetchProducers();
  }, [accounts, activeAccountIndex]);

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
    const activeAccount = accounts[activeAccountIndex];
    if (!activeAccount) {
      return;
    }

    const chain = supportedChains.find(
      item => item.name === activeAccount.chainName,
    );
    if (!chain) {
      return;
    }

    setVoting(true);
    try {
      const sortedVps = votedProducers.slice().sort();
      const res = await voteProducers(sortedVps, activeAccount, chain);
      console.log('vote producer res: ', res);
    } catch (e) {
      console.log('vote failed with error: ', e);
    }
    setVoting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <KHeader
          title={'Vote for Block Producers'}
          subTitle={'You can vote for up to 30 producers.'}
          style={styles.header}
        />
        <View style={styles.balanceContainer}>
          <BalanceItem
            label={'Liquid balance'}
            value={liquidBalance}
            style={styles.balanceItem}
          />
          <BalanceItem
            label={'Refunding'}
            value={refundingBalance}
            style={styles.balanceItem}
          />
          <BalanceItem
            label={'Total staked'}
            value={totalStaked}
            style={styles.balanceItem}
          />
        </View>
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
