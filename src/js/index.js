// index.js - فقط للصفحة الرئيسية
import 'bootstrap/dist/css/bootstrap.rtl.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../scss/main.scss';

import $ from 'jquery';
window.$ = window.jQuery = $;

import './carousel';
import './cart';
import './reviews';
import './validation';

console.log('🌍 هيما - موقع الرحلات السياحية والتخييم في سوريا');