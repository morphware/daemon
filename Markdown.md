# Morphware\'s Tellor Oracles
  - [Purpose of this Document](#purpose-of-this-document)
  - [Cloud Instance Spot Price Oracle](#cloud-instance-spot-price-oracle)
    - [The Role of this Oracle](#the-role-of-this-oracle)
    - [Request](#request)
      - [Example](#request-example)
    - [Response](#response)
      - [Interface](#interface)
      - [Example](#response-example)
    - [Disputes](#disputes)
    - [Submit final reference value](#submit-final-reference-value)



## Purpose of this Document
This document provides the data specification for calling, validating and providing data from Morphware 
Oracles hosted by the Tellor protocol. It will initially outline the neccesity for this data for Morphware. <br>
Then for Morphware and other entities who will use this data, we will discuess how to request this data once stored in Tellor data registry contracts (with a example). 
<br>
Finally, for Tellor miners, we'll go through how to perform a job request for this Oracle, the response interface (with an example), how to validate the response, and how to submit the response.

## Cloud Instance Spot Price Oracle

### The Role of this Oracle

Morphware is a on-chain compute recourse marketplace specifically targeted to running machine learning workloads. Worker nodes on the Morphware network are compensated in MWT (Morphware Token) for their work done to run ML workloads. However, a problem to solve is to understand the amount of MWT required to incentivise data scientists to train their ML workloads on our overlay network as opposed to current off-chain cloud services include [AWS SageMaker](https://aws.amazon.com/sagemaker/) and [Azure ML Studio](https://studio.azureml.net/). To competatively price the compute recourses provided by worker nodes on Morphware with off-chain GPU enables instances, we will use a Tellor Oracle to constantly bring the cloud instance spot pricing data on-chain. This data will be referenced to understand the cost of running an ML workload off-chain, to which Morphware worker nodes will automatically undercut this cost by 20%. Resulting in a significant cheaper alternative for data scientists.

### Request

#### Example

### Response

#### Interface
```
    - string[Ec2Metadata]
    - `packed`: false
``` 
where
```
    - string[Ec2Metadata]
    - `packed`: false
``` 
#### Example

### Disputes

### Submit final reference value


