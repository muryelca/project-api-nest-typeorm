import logoBanner from './assets/logo.webp'

function App() {
  return (
    <div className="container">
      <div className="container-login">
        <div className="wrap-login">
          <form className="login-form">
            <span className="login-form-title">Bem Vindo!</span>
            <span className="login-form-title">
              <img src={logoBanner} alt="BeSafe" />
            </span>
            
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
