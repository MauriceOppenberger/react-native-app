import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity
} from "react-native";
import { white } from "../utils/colors";
import DateHeader from "./DateHeader";
import { connect } from "react-redux";
import { receiveEntries, addEntry } from "../actions";
import { timeToString, getDailyReminderValue } from "../utils/helper";
import { fetchCalendarResults } from "../utils/API";
import UdaciFitnessCalendar from "udacifitness-calendar";
import MetricCard from "./MetricCard";
import { AppLoading } from "expo";

const History = props => {
  const [ready, updateReady] = useState(false);

  useEffect(() => {
    fetchCalendarResults()
      .then(entries => props.dispatch(receiveEntries(entries)))
      .then(({ entries }) => {
        if (!entries[timeToString()]) {
          props.dispatch(
            addEntry({
              [timeToString()]: getDailyReminderValue()
            })
          );
        }
      })
      .then(() => updateReady(true));
  }, []);
  const renderItem = ({ today, ...metrics }, formattedDate, key) => {
    return (
      <View style={styles.item}>
        {today ? (
          <View>
            <DateHeader date={formattedDate} />
            <Text style={styles.noDataText}>{today}</Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("EntryDetail", { entryId: key })
            }
          >
            <MetricCard metrics={metrics} date={formattedDate} />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  const renderEmptyDate = formattedDate => {
    return (
      <View style={styles.item}>
        <DateHeader date={formattedDate} />
        <Text style={styles.noDataText}>No Data for this day</Text>
      </View>
    );
  };
  if (!ready) {
    return <AppLoading />;
  }
  return (
    <UdaciFitnessCalendar
      items={props.entries}
      renderItem={renderItem}
      renderEmptyDate={renderEmptyDate}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: white,
    borderRadius: Platform.OS === "ios" ? 16 : 2,
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    justifyContent: "center",
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: "rgba(0, 0, 0, 0.24)",
    shadowOffset: {
      width: 0,
      height: 3
    }
  },
  noDataText: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20
  }
});

function mapStateToProps(entries) {
  return {
    entries
  };
}
export default connect(mapStateToProps)(History);
