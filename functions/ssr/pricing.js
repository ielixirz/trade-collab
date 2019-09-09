const pricing = `
    <!doctype html>
    <html lang="en">
      <head>
            <!-- Required meta tags -->
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="content-language" content="th" />
        <meta name="description" content="คำอธิบายหน้า" />
        <meta name="keywords" content="คำค้นหา" />
        <meta name="author" content="Weeklyorders" />
        <meta name="copyright" content="Copyright © 2019" />
        <meta name="application-name" content="Weeklyorders" />
        <meta name="robots" content="index, follow" />
    
        <!-- ICON -->
        <link rel="shortcut icon" href="assets/images/fav.ico" type="image/x-icon">
        <link rel="apple-touch-icon" sizes="76x76" href="assets/images/fav.ico">
    
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
    
        <!-- Custom Style CSS -->
        <link rel="stylesheet" type="text/css" href="assets/css/custom.css">
    
        <title>Weekly Order</title>
      </head>
      <body id="page-pricing">
          <div class="wrapper">
            <!-- Navbar -->
          <nav class="navbar navbar-expand-lg navbar-light bg-white" id="top-nav">
            <div class="container">
              <a class="navbar-brand" href="index">
                <div class="brand-img">
                  <img src="assets/images/logo-weekly.png">
                </div>
              </a>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
    
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav ml-lg-auto">
                  <li class="nav-item">
                    <a class="nav-link" href="index">Home</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="about">About</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link active" href="pricing">Pricing</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="support">Sales & Support</a>
                  </li>
                </ul>
                <div class="form-inline my-2 my-lg-0">
                  <a class="btn-login my-2 my-sm-0" href="#">Log-In</a> 
                  <span class="pr-3" style="color: #ff5a5f; font-weight: 600;">|</span>   
                  <a class="btn-signup my-2 my-sm-0" href="#">Sign-Up Free</a>
                </div>
              </div>
            </div>
          </nav>
          <!-- End Navbar -->
            <section id="pricing-section" class="home-section">
            <div class="container">
              <div class="pricing-title text-center">
                <h1 class="clr-green">Pricing Guide</h1>
              </div>
              <div class="pricing-content">
                <div class="table-price mx-auto text-center">
                  <div class="table-price-title">
                    <h1 class="clr-peach">Free</h1>
                    <h2 class="clr-gray">No credit card required</h2>
                  </div>
                  <div class="table-price-img">
                    <img src="assets/images/img_pricing.png" class="img-fluid" alt="pricing">
                  </div>
                  <div class="table-price-desc text-center">
                    <div class="item-price">
                      <span class="price">0</span>
                      <h5>per month</h5>
                    </div>
                    <div class="item-desc">
                      <p><strong>+Unlimited</strong> team members</p>
                      <p><strong>+Unlimited</strong> shipment</p>
                      <p><strong>+24hour</strong> support</p>
                      <p><strong>+10 GB</strong> Storage</p>
                    </div>
                  </div>
                  <a href="#" class="button-primary">Get Started for free!</a>
                </div>
              </div>
            </div>
          </section>
        </div>
    
        <!-- Footer -->
        <footer>
          <div id="footer-top" class="">
            <div class="container">
              <div class="row align-items-center">
                <div class="footter-top-brand-logo">
                  <img src="assets/images/logo-weekly.png" alt="weeklyorders" class="img-fluid">
                </div>
                <div class="footer-nav">
                  <ul class="footer-nav-menu">
                    <li class="ft-nav-item">
                      <a href="about" class="ft-link">About</a>
                    </li>
                    <li class="ft-nav-item">
                      <a href="pricing" class="ft-link">Pricing</a>
                    </li>
                    <li class="ft-nav-item">
                      <a href="support" class="ft-link">Sales & Support</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div id="footer-bottom" class="">
            <span class="copy-right">©2019  weeklyorders • All rights reserved. </span>
          </div>
        </footer>
        <!--End Footer -->
      </body>
        <!-- Script -->
        <!-- Optional JavaScript -->
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="assets/js/jquery/dist/jquery.slim.min.js" ></script>
        <script src="assets/js/popper.js/dist/umd/popper.min.js" ></script>
        <script src="assets/bootstrap/js/bootstrap.min.js"></script>
        <script type="text/javascript">
        $(document).ready(function() {
          if($(window).width() <= 500) {
              $('form div').removeClass('input-group');
          }
      });
    
        $(window).scroll(function() {
        var windowpos = $(window).scrollTop();
        if (windowpos >= 300) {
          $('.navbar').addClass("fixed-top");
        } else {
          $('.navbar').removeClass("fixed-top");  
        }
      });
    
        </script>
    </html>
    
      `;

module.exports = pricing;
