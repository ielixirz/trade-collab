/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable filenames/match-regex */
import React, { Component, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ToastProvider } from 'react-toast-notifications';
import { AppAside, AppHeader } from '@coreui/react';
import {
  ToteToastNotification,
  ToteToastNotificationContainer,
} from '../../component/ToteToastNotification';

// sidebar nav config
// routes config
import routes from '../../routes';
import './DefaultLayout.css';

import { getUserInfoDetail } from '../../actions/userActions';
import { getProlfileList } from '../../actions/profileActions';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {
  componentDidMount() {
    /* THIS PART IS WORK IN PROGRESS, NEED TO REVISE TO ENABLE FULLY FUNCTIONAL FOR MULTIPLE PROFILE SELECTION */
    try {
      this.props.getUserInfoDetail(this.props.auth.uid);
      this.props.getProlfileList(this.props.auth.uid);
    } catch (e) {
      this.props.history.push('/login');
    }
  }

  loading = () => <div className="animated fadeIn pt-1 text-center" />;

  signOut(e) {
    e.preventDefault();
    this.props.history.push('/login');
  }

  render() {
    return (
      <ToastProvider
        placement="top-center"
        autoDismissTimeout={2500}
        components={{
          ToastContainer: ToteToastNotificationContainer,
          Toast: ToteToastNotification,
        }}
      >
        <div className="app" style={{ width: '1280px', height: '720px', margin: 'auto' }}>
          <AppHeader fixed style={{ width: '1280px', marginBottom: '50px' }}>
            <Suspense fallback={this.loading()}>
              <DefaultHeader history={this.props.history} onLogout={e => this.signOut(e)} />
            </Suspense>
          </AppHeader>
          <div className="app-body" style={{ width: '1280px', padding: 10 }}>
            <main className="main">
              <Container fluid>
                <Suspense fallback={this.loading()}>
                  <Switch>
                    {routes.map((route, idx) => (route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => route.validation(
                          route.isProfileRequired,
                          this.props,
                          <route.component {...props} />,
                        )
                          }
                      />
                    ) : null))}
                  </Switch>
                </Suspense>
              </Container>
            </main>
            <AppAside fixed>
              <Suspense fallback={this.loading()}>
                <DefaultAside />
              </Suspense>
            </AppAside>
          </div>
        </div>
      </ToastProvider>
    );
  }
}

const mapStateToProps = (state) => {
  const { authReducer, profileReducer } = state;
  const profile = _.find(
    profileReducer.ProfileList,
    item => item.id === profileReducer.ProfileDetail.id,
  );
  return {
    auth: authReducer.user,
    currentProfile: profile,
  };
};

export default connect(
  mapStateToProps,
  { getUserInfoDetail, getProlfileList },
)(DefaultLayout);
