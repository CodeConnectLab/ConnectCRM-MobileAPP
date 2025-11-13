import React, {useContext, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import MainContainer from '../../../components/MainContainer';
import {View, StyleSheet} from 'react-native';
import {COLORS} from '../../../styles/themes';
import {LeadContainer} from '../../../components/LeadContainer';
import {END_POINT} from '../../../API/UrlProvider';

const ImportedLead = ({user, authData}) => {
  return (
    <MainContainer
      HaderName={"Imported Lead's"}
      screenType={3}
      backgroundColor={COLORS.White}>
      <LeadContainer
        ENDUrl={END_POINT.afterAuth.getImported}
        authData={authData}
        type={'imported lead'}
      />
    </MainContainer>
  );
};

const styles = StyleSheet.create({});

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(ImportedLead);
