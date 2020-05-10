import React from 'react';
import { View, StyleSheet } from 'react-native';
import { KText } from '../../../components';
import { PRIMARY_GRAY, PRIMARY_BLUE } from '../../../theme/colors';
import CheckBox from 'react-native-check-box';

const ProducerListItem = ({
  rank,
  data,
  percentage,
  isVoted,
  onChangeVote,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.rankContainer}>
        <KText style={styles.rankText}>{rank}</KText>
      </View>
      <View style={styles.mainColumn}>
        <KText style={styles.nameText}>{data.owner}</KText>
        <KText style={styles.percentageText}>{percentage} %</KText>
        <KText style={styles.locationText}>{data.location}</KText>
      </View>
      <View style={styles.voteContainer}>
        <KText style={styles.voteText}>Vote</KText>
        <CheckBox
          isChecked={isVoted}
          onClick={() => onChangeVote(data)}
          checkBoxColor={PRIMARY_BLUE}
        />
      </View>
      <KText style={styles.urlText}>{data.url}</KText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E5E5EE',
    paddingVertical: 20,
  },
  rankContainer: {
    width: 24,
    height: 24,
    backgroundColor: PRIMARY_GRAY,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 10,
    color: '#FFF',
  },
  mainColumn: {
    justifyContent: 'space-between',
    marginLeft: 20,
  },
  nameText: {
    fontSize: 16,
  },
  percentageText: {
    color: PRIMARY_BLUE,
    fontSize: 16,
  },
  locationText: {
    fontSize: 14,
    color: PRIMARY_GRAY,
  },
  urlText: {
    position: 'absolute',
    bottom: 20,
    right: 8,
    color: PRIMARY_GRAY,
    fontSize: 14,
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 8,
    top: 20,
  },
  voteText: {
    marginRight: 8,
    color: PRIMARY_GRAY,
    fontSize: 14,
  },
});

export default ProducerListItem;
