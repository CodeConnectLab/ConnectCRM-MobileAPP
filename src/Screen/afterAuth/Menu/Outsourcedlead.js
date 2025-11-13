import React, {useContext, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import MainContainer from '../../../components/MainContainer';
import {View, StyleSheet} from 'react-native';
import {COLORS} from '../../../styles/themes';
import {LeadContainer} from '../../../components/LeadContainer';
import {END_POINT} from '../../../API/UrlProvider';

const Outsourcedlead = ({user, authData}) => {
  return (
    <MainContainer paddingTop={0}>
      <LeadContainer
        ENDUrl={END_POINT.afterAuth.getOutsourced}
        authData={authData}
        type={'Out sourced lead'}
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(Outsourcedlead);
