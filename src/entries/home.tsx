import '../styles/base.css';
import '../styles/home.css';
import { Home } from '../pages/Home';
import { ReviewsAdmin } from '../pages/ReviewsAdmin';
import { mount } from './mount';

if (window.location.pathname === '/reviews-admin') {
  document.getElementById('root')?.replaceChildren();
  mount(<ReviewsAdmin />);
} else {
  mount(<Home />);
}
