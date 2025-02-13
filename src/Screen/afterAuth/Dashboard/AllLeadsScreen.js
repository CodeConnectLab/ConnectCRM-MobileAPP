import React, { useCallback, useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import MainContainer from '../../../components/MainContainer';
import { END_POINT } from '../../../API/UrlProvider';
import { LeadContainer } from '../../../components/LeadContainer';

const AllLeadsScreen = ({ user, authData, route }) => {
  const [paramsData, setparamData] = useState(route?.params || null);

  useEffect(() => {
    if (route?.params) {
      setparamData(route?.params);
    }else{
      setparamData(null);
    }
  }, [route?.params]);

  return (
    <MainContainer screenType={0} paddingTop={0}>
      <LeadContainer
        ENDUrl={END_POINT?.afterAuth?.getAllLead}
        authData={authData}
        type={'lead'}
        selectData={paramsData || null}
      />
    </MainContainer>
  );
};

const mapStateToProps = (state, ownProps) => ({
  user: state.userReducer,
  authData: state.AuthReducer,
});

export default connect(mapStateToProps, React.memo)(AllLeadsScreen);
