import React from 'react';

import Layout from '../../shared/layout';

const styles = {
  display: {
    display: 'none',
  }
};

const Billing = () => {
  return (
    <Layout>
      <div className="content-wrapper">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6">
              <h1 className="text-center mb-1 mt-4">Subscribe</h1>
            </div>
          </div>

          <hr className="mt-3" />

          <div className="row justify-content-center">
            <div className="col-12 col-md-6">
              <p className="lead mb-3">Summary</p>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>Monthly subscription <small className="d-block text-secondary">1 user</small></span>
                  <span>$30</span>
                </li>
                <li className="list-group-item d-flex justify-content-between bg-light align-items-center">
                  <span className="text-success">Promo Code <small className="d-block text-success">EXAMPLECODE1</small></span>
                  <span className="text-success">-$30</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center border-top">
                  <span>Total (USD)</span>
                  <strong>$0</strong>
                </li>
              </ul>

              <form className="card p-2 mt-2">
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Promo/Referral code" />
                  <div className="input-group-append">
                    <button type="submit" className="btn btn-primary" disabled="">Apply</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <hr className="mt-4" />
          <div className="row justify-content-center mt-2">
            <div className="col-12 col-md-6">
              <p className="lead mb-3">Payment Information</p>
              <form>
                <div className="form-group">
                  <label htmlFor="cardName" className="text-muted">Name on card</label>
                  <input type="text" className="form-control" id="cardName" placeholder="" required="" />
                  <small className="text-muted">Full name as displayed on card</small>
                  <div className="invalid-feedback">Name on card is required</div>
                </div>
                <div className="form-group">
                  <label htmlFor="cardNumber" className="text-muted">Card Number</label>
                  <div className="input-group">
                    <div className="input-group-append">
                      <span className="input-group-text text-muted rounded-left">
                        <i className="fab fa-cc-visa text-primary" aria-hidden="true"></i>
                        <i className="fab fa-cc-amex text-primary" style={styles.display} aria-hidden="true"></i>
                        <i className="fab fa-cc-mastercard text-primary" style={styles.display} aria-hidden="true"></i>
                        <i className="fab fa-cc-discover text-primary" style={styles.display} aria-hidden="true"></i>
                        <i className="fas fa-credit-card-front" style={styles.display} aria-hidden="true"></i>
                      </span>
                    </div>
                    <input type="text" id="cardNumber" placeholder="" className="form-control" required="" />
                    <div className="invalid-feedback">Valid card number is required</div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="cardExp" className="text-muted">Expiration</label>
                  <div className="input-group">
                    <input type="number" placeholder="MM" name="cardExp" id="cardExpMonth" className="form-control" required=""  />
                    <input type="number" placeholder="YY" name="cardExp" id="cardExpYear" className="form-control" required="" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col">
                    <label htmlFor="cardCode" className="text-muted" data-toggle="tooltip" title="" data-original-title="Three-digits code on the back of your card"> Security Code <i className="far fa-question-circle text-primary" aria-hidden="true"></i></label>
                    <input type="text" className="form-control" id="cardCode" placeholder="" />
                    <div className="invalid-feedback">Security Code is required</div>
                  </div>
                  <div className="col">
                    <label htmlFor="zip" className="text-muted">Zip Code</label>
                    <input type="text" className="form-control" id="zip" placeholder="" required=""  />
                    <div className="invalid-feedback">Zip code is required</div>
                  </div>
                </div>
                <button id="save-cc" type="button" className="btn btn-primary btn-block my-4" data-slide="next">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

Billing.displayName = 'Billing';
export default Billing;
