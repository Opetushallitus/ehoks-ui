import { createGlobalStyle } from "styled"

export const EditHOKSStyles = createGlobalStyle`
  .form-group p {
    margin: 0 0 10px 0;
  }

  .form-group {
    ${props => props.theme.typography.body}
    margin-bottom: 15px;
  }

  .form-group fieldset {
    min-width: 0;
    padding: 0;
    margin: 0;
    border: 0;
  }

  .form-group legend {
    display: block;
    width: 100%;
    padding: 0;
    margin-bottom: 20px;
    font-size: 21px;
    line-height: inherit;
    color: #333;
    border: 0;
    border-bottom: 1px solid #e5e5e5;
  }

  .form-group label {
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
    font-weight: 700;
  }

  .form-group .form-control {
    display: block;
    width: 100%;
    padding: 10px;
    font-size: 16px;
    line-height: 1.31;
    line-height: 1.42857143;
    color: #6e6e7e;
    background-color: #fff;
    background-image: none;
    border: 1px solid #6e6e7e;
    border-radius: 2px;
    -webkit-box-shadow: unset;
    box-shadow: unset;
    -webkit-transition: unset;
    -o-transition: unset;
    transition: unset;
  }

  .form-group .has-error .form-control {
    border-color: #a94442;
    /* -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075); */
  }

  .form-group .has-error .control-label {
    color: #a94442;
  }

  .form-group .field-description {
    font-size: 16px;
  }

  .form-group .field-object .field-string .field-description,
  .form-group .field-object .field-integer .field-description {
    font-size: 14px;
  }

  .form-group .field-object .field-description {
    font-size: 14px;
  }

  .text-danger {
    color: #a94442;
  }

  .btn {
    display: inline-block;
    padding: 10px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 2px;
  }

  .btn-info {
    color: #fff;
    background-color: #3A7A10;
    border-color: #3A7A10;
  }

  .btn-danger {
    color: #fff;
    background-color: #c62828;
    border-color: #c62828;
  }

  .btn-default {
    color: #333;
    background-color: #fff;
    border-color: #ccc;
  }

  .btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .btn.disabled,
  .btn[disabled],
  fieldset[disabled] .btn {
    cursor: not-allowed;
    filter: alpha(opacity=65);
    -webkit-box-shadow: none;
    box-shadow: none;
    opacity: 0.65;
  }

  .btn-group > .btn:first-child {
    margin-left: 0;
  }

  .btn-group-vertical > .btn,
  .btn-group > .btn {
    position: relative;
    float: left;
  }

  .btn-group-vertical > .btn-group:after,
  .btn-group-vertical > .btn-group:before,
  .btn-toolbar:after,
  .btn-toolbar:before,
  .clearfix:after,
  .clearfix:before,
  .container-fluid:after,
  .container-fluid:before,
  .container:after,
  .container:before,
  .dl-horizontal dd:after,
  .dl-horizontal dd:before,
  .form-horizontal .form-group:after,
  .form-horizontal .form-group:before,
  .modal-footer:after,
  .modal-footer:before,
  .modal-header:after,
  .modal-header:before,
  .nav:after,
  .nav:before,
  .navbar-collapse:after,
  .navbar-collapse:before,
  .navbar-header:after,
  .navbar-header:before,
  .navbar:after,
  .navbar:before,
  .pager:after,
  .pager:before,
  .panel-body:after,
  .panel-body:before,
  .row:after,
  .row:before {
    display: table;
    content: " ";
  }

  .btn-group-vertical > .btn-group:after,
  .btn-toolbar:after,
  .clearfix:after,
  .container-fluid:after,
  .container:after,
  .dl-horizontal dd:after,
  .form-horizontal .form-group:after,
  .modal-footer:after,
  .modal-header:after,
  .nav:after,
  .navbar-collapse:after,
  .navbar-header:after,
  .navbar:after,
  .pager:after,
  .panel-body:after,
  .row:after {
    clear: both;
  }

  /* .row {
    margin-right: -15px;
    margin-left: -15px;
  } */

  .col-xs-offset-9 {
    margin-left: 75%;
  }

  .col-xs-2 {
    width: 16.66666667%;
  }

  .col-xs-3 {
    width: 25%;
  }

  .col-xs-9 {
    width: 75%;
  }

  .col-xs-12 {
    width: 100%;
  }

  .col-xs-1,
  .col-xs-10,
  .col-xs-11,
  .col-xs-12,
  .col-xs-2,
  .col-xs-3,
  .col-xs-4,
  .col-xs-5,
  .col-xs-6,
  .col-xs-7,
  .col-xs-8,
  .col-xs-9 {
    float: left;
  }

  .col-lg-1,
  .col-lg-10,
  .col-lg-11,
  .col-lg-12,
  .col-lg-2,
  .col-lg-3,
  .col-lg-4,
  .col-lg-5,
  .col-lg-6,
  .col-lg-7,
  .col-lg-8,
  .col-lg-9,
  .col-md-1,
  .col-md-10,
  .col-md-11,
  .col-md-12,
  .col-md-2,
  .col-md-3,
  .col-md-4,
  .col-md-5,
  .col-md-6,
  .col-md-7,
  .col-md-8,
  .col-md-9,
  .col-sm-1,
  .col-sm-10,
  .col-sm-11,
  .col-sm-12,
  .col-sm-2,
  .col-sm-3,
  .col-sm-4,
  .col-sm-5,
  .col-sm-6,
  .col-sm-7,
  .col-sm-8,
  .col-sm-9,
  .col-xs-1,
  .col-xs-10,
  .col-xs-11,
  .col-xs-12,
  .col-xs-2,
  .col-xs-3,
  .col-xs-4,
  .col-xs-5,
  .col-xs-6,
  .col-xs-7,
  .col-xs-8,
  .col-xs-9 {
    position: relative;
    min-height: 1px;
    padding-right: 15px;
    padding-left: 15px;
  }

  .text-right {
    text-align: right;
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    float: left;
    min-width: 160px;
    padding: 5px 0;
    margin: 2px 0 0;
    list-style: none;
    font-size: 14px;
    text-align: left;
    background-color: #fff;
    border: 1px solid #ccc;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
    background-clip: padding-box;
  }
  .dropdown-menu.pull-right {
    right: 0;
    left: auto;
  }
  .dropdown-menu .divider {
    height: 1px;
    margin: 9px 0;
    overflow: hidden;
    background-color: #e5e5e5;
  }
  .dropdown-menu > li > a {
    display: block;
    padding: 3px 20px;
    clear: both;
    font-weight: normal;
    line-height: 1.42857143;
    color: #333333;
    white-space: nowrap;
  }
  .dropdown-menu > li > a:hover,
  .dropdown-menu > li > a:focus {
    text-decoration: none;
    color: #262626;
    background-color: #f5f5f5;
  }
  .dropdown-menu > .active > a,
  .dropdown-menu > .active > a:hover,
  .dropdown-menu > .active > a:focus {
    color: #fff;
    text-decoration: none;
    outline: 0;
    background-color: #3A7A10;
  }
  .dropdown-menu > .disabled > a,
  .dropdown-menu > .disabled > a:hover,
  .dropdown-menu > .disabled > a:focus {
    color: #777777;
  }
  .dropdown-menu > .disabled > a:hover,
  .dropdown-menu > .disabled > a:focus {
    text-decoration: none;
    background-color: transparent;
    background-image: none;
    filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);
    cursor: not-allowed;
  }

  .dropdown-item {
    display: block;
    width: 100%;
    padding: .25rem 1.5rem;
    clear: both;
    font-weight: 400;
    color: #212529;
    text-align: inherit;
    white-space: nowrap;
    background-color: transparent;
    border: 0;
  }

  .dropdown-item:hover {
    color: #254905;
  }

  .open > .dropdown-menu {
    display: block;
  }
  .dropdown-menu-right {
    left: auto;
    right: 0;
  }
  .dropdown-menu-left {
    left: 0;
    right: auto;
  }
  .pull-right > .dropdown-menu {
    right: 0;
    left: auto;
  }
  .dropup .dropdown-menu,
  .navbar-fixed-bottom .dropdown .dropdown-menu {
    top: auto;
    bottom: 100%;
    margin-bottom: 2px;
  }
  .close {
    float: right;
    font-size: 21px;
    font-weight: bold;
    line-height: 1;
    color: #000;
    text-shadow: 0 1px 0 #fff;
    opacity: 0.2;
    filter: alpha(opacity=20);
  }
  .close:hover,
  .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
    opacity: 0.5;
    filter: alpha(opacity=50);
  }
  button.close {
    padding: 0;
    cursor: pointer;
    background: transparent;
    border: 0;
    -webkit-appearance: none;
  }

  .sr-only {
    display: none;
  }
`
