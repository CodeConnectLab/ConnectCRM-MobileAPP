import React, {useContext, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import MainContainer from '../../../components/MainContainer';

import {LeadContainer} from '../../../components/LeadContainer';
import {END_POINT} from '../../../API/UrlProvider';

const FollowupScreen = ({user, authData}) => {
  return (
    <MainContainer paddingTop={0}>
      <LeadContainer
        ENDUrl={END_POINT.afterAuth.getFollowup}
        authData={authData}
        type={'followup'}
      />
    </MainContainer>
  );
};

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(FollowupScreen);
