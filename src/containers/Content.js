// Content.js

import React, {Component} from 'react';

export default class Content extends Component {
    render(){
        return (
            <div id="page-content">
                <div class="content-header">
                    <div class="header-section">
                        <h1><i class="gi gi-usd"></i>Invoice<br/><small>UI for getting paid!</small></h1>
                    </div>
                </div>
                <ul class="breadcrumb breadcrumb-top">
                <li>Pages</li>
                <li><a href="">Invoice</a></li>
                </ul>
                <div class="block full">
                    <div class="block-title">
                        <div class="block-options pull-right">                
                    </div>
                    <h2><strong>Invoice</strong> #INV0152</h2>
                </div>
                <div class="row block-section">
                    <div class="col-sm-6">                        
                    </div>
                    <div class="col-sm-6 text-right">                
                    </div>
                </div>
            </div>
        </div>
        )
    }
}