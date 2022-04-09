# Morphware\'s Tellor Oracles
  - [Purpose of this Document](#purpose-of-this-document)
  - [Cloud Instance Spot Price Oracle](#cloud-instance-spot-price-oracle)
    - [The Role of this Oracle](#the-role-of-this-oracle)
    - [Data Specification](#data-specificiation)
      - [Interface](#interface)
      - [Example](#response-example)
    - [Requesting this Data from a Tellor Data Registry](#requesting-this-data-from-a-tellor-data-registry)
    - [Providing this Data as a Tellor Miner](#providing-this-data-as-a-tellor-miner)
      - [Query Version](#query-version)
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

### Data Specification

#### Interface
```
    string[Ec2Metadata]
``` 
where
```
    Interface Ec2MetaData {
        "Instance Type": str,
        "CUDA Cores": int,
        "Number of CPUs": int,
        "RAM": float,
        "On-demand Price per Hour": float,
    }
``` 
#### Example
This is a subset of the entire response. The entire response has 21 objects returned.
```
    [
        {
            'Instance Type': 'p2.16xlarge', 
            'CUDA Cores': 79872, 
            'Number of CPUs': 64, 
            'RAM': 732.0, 
            'On-demand Price per Hour': 14.4
        }, 
        {
            'Instance Type': 'p2.8xlarge', 
            'CUDA Cores': 39936, 
            'Number of CPUs': 32, 
            'RAM': 488.0, 
            'On-demand Price per Hour': 7.2
        }, 
        {
            'Instance Type': 'p2.xlarge', 
            'CUDA Cores': 4992, 
            'Number of CPUs': 4, 
            'RAM': 61.0, 'On-demand Price per Hour': 0.9
        }, 
        {
            'Instance Type': 'g3s.xlarge', 
            'CUDA Cores': 4096, 
            'Number of CPUs': 4, 
            'RAM': 30.5, 
            'On-demand Price per Hour': 0.75
        }, 
        {
            'Instance Type': 'g4dn.xlarge', 
            'CUDA Cores': 2560, 
            'Number of CPUs': 4, 
            'RAM': 16.0, 
            'On-demand Price per Hour': 0.526
        }, 
        {
            'Instance Type': 'g3.16xlarge', 
            'CUDA Cores': 16384, 
            'Number of CPUs': 64, 
            'RAM': 488.0, 
            'On-demand Price per Hour': 4.56
        }, 
        {
            'Instance Type': 'g3.4xlarge', 
            'CUDA Cores': 4096, 
            'Number of CPUs': 16, 
            'RAM': 122.0, 
            'On-demand Price per Hour': 1.14
        }, 
        {
            'Instance Type': 'g3.8xlarge', 
            'CUDA Cores': 8192, 
            'Number of CPUs': 32, 
            'RAM': 244.0, 
            'On-demand Price per Hour': 2.28
        }
        ...
    ]
``` 



### Requesting this Data from a Tellor Data Registry

- TODO (Should be able to complete this once the Oracle is live)

### Providing this data as a Tellor Miner

#### Serving this Job using Telliot Core
- Refer to Tellors Official Documentation on [Telliot Core](https://github.com/tellor-io/telliot-core)

#### Query Version
- TODO (Since this is the first iteration of this Oracle job, would it be query version 1?)

#### Disputes
Ec2MetaData being an object, there are 5 validation checks Tellor miners will perform prior to submitting the value to a Tellor data registry.
For each Ec2MetaData object in the returned Array of Ec2MetaData. We must valdiate:
- The instance's names does not change
- The instance's number of CUDA Cores  does not change
- The instance's number of CPU's does not change
- The instance's RAM does not change
- The on-demand price per hour does not change greater than 10% when compared to the last reported price per hour value given of the instance

### Endpoints
We will add more endpoints for redundancy to ensure data integrity in the future.
1. http://167.172.239.133:5000/products-2



