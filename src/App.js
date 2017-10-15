'use strict';

import React, { Component } from 'react';
import Webcam from 'react-webcam';
import base64Img from 'base64-img';
import request from 'superagent';

import facialRecog from './API/facialRecog';
import './App.css';
import image from './images/CheckMark.png';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: ''
    }
  }

  setRef = (webcam) => {
    this.webcam = webcam;
  }

  capture = () => {
    const fs = require('fs');
    
    const imageSrc = this.webcam.getScreenshot();
    this.setState({ test: imageSrc });
    // const data = imageSrc.replace(/^data:image\/\w+;base64,/, "");
    
    return request.get(`http://localhost:4000/api/id/${encodeURIComponent(imageSrc)}`)
    .set("Content-Type", "application/octet-stream")
    .end(
      (err, res) => {
        if (err || !res.ok) {
          console.log(err);
        } 
        console.log(res)
        window.location.href = `http://localhost:4000/api/id/${encodeURIComponent(imageSrc)}`;
      }
    );
  };

  render() {
    return (
        <div className="">
            <div className="container-fluid App-header">
              <h1 style={{ textAlign: 'center', color: 'white' }}>Check Out</h1>
            </div>

            <div className="container-fluid">
              <div className="row">
                <div className="col-md-6" style={{ textAlign: 'center' }}>
                  <Webcam
                    audio={false}
                    height={400}
                    ref={this.setRef}
                    screenshotFormat="image/jpeg"
                    width={400}
                  />

                  <div><h2>Melvin Torres</h2></div>                
                  {/* <img style={{ height: '80px', width: '80px' }} src={image}/> */}
                  {/* <img src={this.state.test} /> */}

                  <div>{this.state.test}</div>
                </div>

                <div className="col-md-6">
                  <div className="container-fluid">
                    <div className="card">
                      <h4 style={{ textAlign: 'center' }}><b>Receipts</b></h4> 
                      <div style={{ marginLeft: '30px', fontSize: '16px', paddingTop: '10px' }}>
                        <p>1x{'   '}Tooth Paste{'      '}$ 2.50</p>
                        <p>2x{'   '}Shirts{'           '}$ 5.00</p>
                        <p>1x{'   '}Shoe{'             '}$60.00</p>
                        <p>5x{'   '}Tennis Balls{'     '}$20.00</p>
                        <p>7x{'   '}Apples{'           '}$ 6.50</p>
                        <p>3x{'   '}Ice Cream{'        '}$ 9.00</p>
                      </div>

                      <div style={{ marginLeft: '30px', paddingTop: '200px' }}>
                        <h3>Total: $103</h3>
                      </div>

                  </div>
                  
                  <button 
                    style={{ marginLeft: '115px', marginTop: '15px', color: 'white'}}
                    type="button" 
                    className="btn btn-default btn-lg App-button"
                    onClick={this.capture}
                  >
                    Request Payment
                  </button>
                </div>
                </div>
              </div>
            </div>
            

        </div>
    );
  }
}

export default App;
