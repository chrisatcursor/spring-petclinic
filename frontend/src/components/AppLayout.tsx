import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { appStyles } from '../styles.ts';

type MenuKey = 'home' | 'owners' | 'vets' | 'error';

const navItems: Array<{
  to: string;
  menu: MenuKey;
  testId: string;
  title: string;
  icon: string;
  text: string;
}> = [
  { to: '/', menu: 'home', testId: 'nav-home', title: 'home page', icon: 'home', text: 'Home' },
  {
    to: '/owners/find',
    menu: 'owners',
    testId: 'nav-owners',
    title: 'find owners',
    icon: 'search',
    text: 'Find owners',
  },
  {
    to: '/vets.html',
    menu: 'vets',
    testId: 'nav-vets',
    title: 'veterinarians',
    icon: 'th-list',
    text: 'Veterinarians',
  },
  {
    to: '/oups',
    menu: 'error',
    testId: 'nav-error',
    title: 'trigger a RuntimeException to see how it is handled',
    icon: 'exclamation-triangle',
    text: 'Error',
  },
];

function menuForPath(pathname: string): MenuKey {
  if (pathname.startsWith('/owners')) {
    return 'owners';
  }
  if (pathname.startsWith('/vets')) {
    return 'vets';
  }
  if (pathname.startsWith('/oups') || pathname === '/nonexistent') {
    return 'error';
  }
  return 'home';
}

export function AppLayout() {
  const location = useLocation();
  const activeMenu = menuForPath(location.pathname);

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-dark" role="navigation">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" aria-label="PetClinic home">
            PetClinic
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#main-navbar"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="main-navbar">
            <ul className="nav navbar-nav me-auto">
              {navItems.map((item) => (
                <li className="nav-item" key={item.testId}>
                  <NavLink
                    className={`nav-link${activeMenu === item.menu ? ' active' : ''}`}
                    to={item.to}
                    title={item.title}
                    data-testid={item.testId}
                  >
                    <span className={`fa fa-${item.icon}`} aria-hidden="true" />
                    <span>{item.text}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="container xd-container app-content">
          <Outlet />
        </div>
      </div>
      <footer className="app-footer">
        <img
          src="/resources/images/spring-logo.svg"
          alt="VMware Tanzu Logo"
          className="logo"
          style={appStyles.logo}
        />
      </footer>
    </div>
  );
}
