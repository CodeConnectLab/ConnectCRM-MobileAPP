/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './RootNavigation';
import {ScreenIdentifiers, Screens} from '.';
import {
  horizontalAnimation,
  fadAnimation,
  horizontalLeftAnimation,
  verticalAnimation,
} from './AnimationUtils';

const Stack = createStackNavigator();

// Create a wrapper component for SplashScreen that handles permission state
const SplashScreenWrapper = ({permissionsHandled, ...props}) => {
  // Pass the permissionsHandled prop to the SplashScreen component
  return <Screens.SplashScreen permissionsHandled={permissionsHandled} {...props} />;
};

const MainRoute = ({permissionsHandled = false}) => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={ScreenIdentifiers.SplashScreen}>
        <Stack.Screen
          name={ScreenIdentifiers.SplashScreen}
          options={fadAnimation}
        >
          {props => <SplashScreenWrapper {...props} permissionsHandled={permissionsHandled} />}
        </Stack.Screen>
        <Stack.Screen
          name={ScreenIdentifiers.LoginScreen}
          component={Screens.LoginScreen}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.Dashboard}
          component={Screens.Dashboard}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.ForgotPassword}
          component={Screens.ForgotPassword}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.CallHistory}
          component={Screens.CallHistory}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.CallDetailsList}
          component={Screens.CallDetailsList}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.MenuHeader}
          component={Screens.MenuHeader}
          options={horizontalLeftAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.NotificationsScreen}
          component={Screens.NotificationsScreen}
          options={horizontalAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.Settings}
          component={Screens.Settings}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.LogoutScreen}
          component={Screens.LogoutScreen}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.ChangePassowrd}
          component={Screens.ChangePassowrd}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.UserDetails}
          component={Screens.UserDetails}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.AddLeadScreen}
          component={Screens.AddLeadScreen}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.ImportedLead}
          component={Screens.ImportedLead}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.LeadsDetailsScreen}
          component={Screens.LeadsDetailsScreen}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.CompanyDetails}
          component={Screens.CompanyDetails}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.UpdateCompany}
          component={Screens.UpdateCompany}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.AnalyticReportScreen}
          component={Screens.AnalyticReportScreen}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.CallReportScreen}
          component={Screens.CallReportScreen}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.ImageViewScreen}
          component={Screens.ImageViewScreen}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.Outsourcedlead}
          component={Screens.Outsourcedlead}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.DepartmentScreen}
          component={Screens.DepartmentScreen}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.DepartmentDetails}
          component={Screens.DepartmentDetails}
          options={fadAnimation}
        />
        <Stack.Screen
          name={ScreenIdentifiers.ProductService}
          component={Screens.ProductService}
          options={fadAnimation}
        />
         <Stack.Screen
          name={ScreenIdentifiers.CalendarScreen}
          component={Screens.CalendarScreen}
          options={fadAnimation}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainRoute;
