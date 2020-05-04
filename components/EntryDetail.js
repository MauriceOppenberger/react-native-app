import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import styled from "styled-components";
import { connect } from "react-redux";
import { white } from "../utils/colors";
import MetricCard from "./MetricCard";
import { addEntry } from "../actions";
import { removeEntry } from "../utils/API";
import { timeToString, getDailyReminderValue } from "../utils/helper";
import TextButton from "./TextButton";

const StyledView = styled.View`
  flex: 1;
  background-color: ${white};
  padding: 15px;
`;

class EntryDetail extends React.Component {
  setTitle = entryId => {
    if (!entryId) return;

    const year = entryId.slice(0, 4);
    const month = entryId.slice(5, 7);
    const day = entryId.slice(8);

    this.props.navigation.setOptions({
      title: `${month}/${day}/${year}`
    });
  };

  shouldComponentUpdate(nextProps) {
    return nextProps !== null && !nextProps.metrics.today;
  }
  reset = () => {
    const { remove, goBack, entryId } = this.props;

    remove();
    goBack();
    removeEntry(entryId);
  };

  render() {
    const { metrics } = this.props;
    const { entryId } = this.props.route.params;

    this.setTitle(entryId);

    return (
      <StyledView>
        <MetricCard metrics={metrics} />
        <TextButton onPress={this.reset} style={{ margin: 20 }}>
          RESET
        </TextButton>
      </StyledView>
    );
  }
}

function mapStateToProps(state, { route }) {
  const { entryId } = route.params;
  return {
    entryId,
    metrics: state[entryId]
  };
}

function mapDispatchToProps(dispatch, { route, navigation }) {
  const { entryId } = route.params;
  return {
    remove: () =>
      dispatch(
        addEntry({
          [entryId]: timeToString() === entryId ? getDailyReminderValue() : null
        })
      ),
    goBack: () => navigation.goBack()
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail);
