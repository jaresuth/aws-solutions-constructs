/**
 *  Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

// Imports
import { App, Stack } from "@aws-cdk/core";
import * as defaults from '@aws-solutions-constructs/core';
import { PrivateHostedZone } from "@aws-cdk/aws-route53";
import { Route53ToAlb, Route53ToAlbProps } from "../lib";
import { generateIntegStackName } from '@aws-solutions-constructs/core';

// Setup
const app = new App();
const stack = new Stack(app, generateIntegStackName(__filename));
stack.templateOptions.description = 'Integration Test for aws-route53-alb';

const newVpc = defaults.buildVpc(stack, {
  defaultVpcProps: defaults.DefaultPublicPrivateVpcProps(),
  constructVpcProps: {
    enableDnsHostnames: true,
    enableDnsSupport: true,
    cidr: '172.168.0.0/16',
  },
});

const newZone = new PrivateHostedZone(stack, 'new-zone', {
  zoneName: 'www.test-example.com',
  vpc: newVpc,
});

// Definitions
const props: Route53ToAlbProps = {
  publicApi: false,
  existingHostedZoneInterface: newZone,
  existingVpc: newVpc,
};

new Route53ToAlb(stack, 'test-route53-alb', props);

// Synth
app.synth();