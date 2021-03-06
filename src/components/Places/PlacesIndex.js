import React, {
  Component,
  PropTypes,
} from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/yelp.actions';
import Helmet from 'react-helmet';
import './PlacesIndex.scss';
import ScrollToTopOnMount from '../ScrollToTopOnMount/ScrollToTopOnMount';
import PlacePreview from './PlacePreview';
import SearchForm from './SearchForm';

class PlacesIndex extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSearch = this.handleSearch.bind(this);
    this.handleConfirmLocation = this.handleConfirmLocation.bind(this);
  }

  componentDidMount() {
    this.props.actions.searchDefault(this.props.current, this.props.search);
  }

  handleSearch(formData) {
    this.props.actions.searchSubmit(formData);
  }

  handleConfirmLocation(place, isConfirming) {
    this.props.actions.toggleConfirmPlace(place, isConfirming);
  }

  render() {
    const { places, authenticated, confirm, user } = this.props;

    return (
      <section className="places-page">
        <ScrollToTopOnMount/>
        <Helmet
          title="Wubto"
          titleTemplate="%s | Places"
        />
        <section className="search">
          <SearchForm onSubmit={this.handleSearch}/>
        </section>
        <section className="status">
          <div className="breadcrumb alert-info">
            <label>Your Plans: </label><Link to={((user.place && user.place.id) ? "/places/id/" + user.place.id : "/places")}>
            {user.place && user.place.name || 'Not set'}
            {user.place && user.place.id && (new Date(user.place.expiresAt).toISOString() < new Date().toISOString()) ? ' (Expired)' : null}</Link>
          </div>
        </section>
        <section className="places-list">
          <label>Results: </label><text>{places.length}</text>
          { places.map(place => <PlacePreview key={place.id} place={place} handleClick={this.handleConfirmLocation} confirm={confirm} user={user} authenticated={authenticated}/>) }
        </section>
      </section>
    );
  }
}

PlacesIndex.propTypes = {
  actions: PropTypes.object.isRequired,
  user: PropTypes.object,
  authenticated: PropTypes.bool.isRequired,
  search: PropTypes.object.isRequired,
  current: PropTypes.object.isRequired,
  places: PropTypes.array.isRequired,
  confirm: PropTypes.object.isRequired
};
PlacesIndex.defaultProps = {};

function mapStateToProps(state) {
  return {
    user: state.auth.user || {},
    authenticated: state.auth.authenticated,
    search: state.yelp.search || {},
    current: state.yelp.current || {},
    places: state.yelp.places || [],
    confirm: state.yelp.confirm || {}
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlacesIndex);
