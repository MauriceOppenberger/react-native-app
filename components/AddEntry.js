import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet
} from "react-native";
import {
  getMetricMetaInfo,
  timeToString,
  getDailyReminderValue,
  clearLocalNotification,
  setLocalNotification
} from "../utils/helper";
import NativSlider from "./NativSlider";
import Stepper from "./Stepper";
import DateHeader from "./DateHeader";
import { Ionicons } from "@expo/vector-icons";
import TextButton from "./TextButton";
import { submitEntry, removeEntry } from "../utils/API";
import { connect } from "react-redux";
import { addEntry } from "../actions";
import { white, purple } from "../utils/colors";
import { CommonActions } from "@react-navigation/native";

function SubmitBtn({ onPress }) {
  return (
    <TouchableOpacity
      style={
        Platform.OS === "ios" ? styles.iosSubmitBtn : styles.AndroidSubmitBtn
      }
      onPress={onPress}
    >
      <Text style={styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  );
}
const AddEntry = props => {
  const [state, updateState] = useState({
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  });

  const incregment = metric => {
    const { max, step } = getMetricMetaInfo(metric);
    updateState(state => {
      const count = state[metric] + step;
      return { ...state, [metric]: count > max ? max : count };
    });
  };

  const decrement = metric => {
    updateState(state => {
      const count = state[metric] - getMetricMetaInfo(metric).step;
      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      };
    });
  };

  const slide = (metric, value) => {
    updateState(() => ({ [metric]: value }));
  };

  const submit = () => {
    const key = timeToString();
    const entry = state;

    // Update Redux
    props.dispatch(
      addEntry({
        [key]: entry
      })
    );

    updateState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    });

    //Navigate to home
    toHome();

    submitEntry(entry, key);

    //clear local notifcation
    clearLocalNotification().then(setLocalNotification);
  };

  const toHome = () => {
    props.navigation.dispatch(
      CommonActions.goBack({
        key: "AddEntry"
      })
    );
  };
  const metaInfo = getMetricMetaInfo();

  const reset = () => {
    const key = timeToString();
    //update Redux
    props.dispatch(
      addEntry({
        [key]: getDailyReminderValue()
      })
    );
    // return to home

    toHome();

    removeEntry(key);
  };

  if (props.alreadyLogged) {
    return (
      <View>
        <Ionicons
          name={Platform.OS === "ios" ? "ios-happy" : "md-happy"}
          size={100}
        />
        <Text>You already logged you information for today</Text>
        <TextButton style={{ padding: 10 }} onPress={reset}>
          Reset
        </TextButton>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <DateHeader date={new Date().toLocaleDateString()} />

      {Object.keys(metaInfo).map(key => {
        const { getIcon, type, ...rest } = metaInfo[key];
        const value = state[key];

        return (
          <View key={key} style={styles.row}>
            {getIcon()}
            {type === "slider" ? (
              <NativSlider
                value={value}
                onChange={value => slide(key, value)}
                {...rest}
              />
            ) : (
              <Stepper
                value={value}
                onIncrement={() => incregment(key)}
                onDecrement={() => decrement(key)}
                {...rest}
              />
            )}
          </View>
        );
      })}
      <SubmitBtn onPress={submit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center"
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40
  },
  AndroidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center"
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: "center"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 30,
    marginRight: 30
  }
});

function mapStateToProps(state) {
  const key = timeToString();
  return {
    alreadyLogged: state[key] && typeof state[key].today === "undefined"
  };
}

export default connect(mapStateToProps)(AddEntry);
