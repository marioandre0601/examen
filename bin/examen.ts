#!/usr/bin/env node
// -*- mode: typescript -*-
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ExamenStack } from '../lib/examen-stack';

const app = new cdk.App();
new ExamenStack(app, 'my-lambda');
