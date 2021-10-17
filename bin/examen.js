#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// -*- mode: typescript -*-
require("source-map-support/register");
const cdk = require("@aws-cdk/core");
const examen_stack_1 = require("../lib/examen-stack");
const app = new cdk.App();
new examen_stack_1.ExamenStack(app, 'my-lambda');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbWVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXhhbWVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDJCQUEyQjtBQUMzQix1Q0FBcUM7QUFDckMscUNBQXFDO0FBQ3JDLHNEQUFrRDtBQUVsRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLDBCQUFXLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuLy8gLSotIG1vZGU6IHR5cGVzY3JpcHQgLSotXG5pbXBvcnQgJ3NvdXJjZS1tYXAtc3VwcG9ydC9yZWdpc3Rlcic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBFeGFtZW5TdGFjayB9IGZyb20gJy4uL2xpYi9leGFtZW4tc3RhY2snO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IEV4YW1lblN0YWNrKGFwcCwgJ215LWxhbWJkYScpO1xuIl19