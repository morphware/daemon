'use strict';
const csv = require('csv-parser');
const fs = require('fs');
const {conf} = require('../conf');
const os = require("os");
const Web3 = require("web3");

const GPUtoCUDAMapping = {
    "3090": 10496,
    "3080Ti": 10240,
    "3080": 8704,
    "3070Ti": 6144,
    "3070": 5888,
    "3060Ti": 4864,
    "3060": 3584,
    "2080Ti": 4352,
    "2080s": 3072,
    "2080": 2944,
    "2070s": 2560,
    "2070": 2304,
    "2060s": 2176,
    "2060": 1920,
}

async function calculateBid(trainingTimeInHours) {
    try {
        if(!conf.workerGPU) throw("Worker GPU not selected")
        console.log("My GPU: ", conf.workerGPU);
        const workerCUDACores = GPUtoCUDAMapping[conf.workerGPU];
        console.log("My GPU's CUDO Core Count: ", workerCUDACores);
        console.log("Training Time: ", trainingTimeInHours)
        const competingAWSCUDAPricePerHour = await findClosestCUDACorePerHourPrice(workerCUDACores);
        console.log("competingAWSCUDAPricePerHour: ", competingAWSCUDAPricePerHour);
        const biddingValueUSD = competingAWSCUDAPricePerHour * workerCUDACores * parseInt(trainingTimeInHours) * 0.8;
        console.log("Bidding Value in USD: ", biddingValueUSD)
        
        //TODO: THIS IS TEMPORARY. Assuming    1 MWT = 0.1 USD
        let biddingValueMWT = Math.round(biddingValueUSD * 10);
        biddingValueMWT =  Web3.utils.toWei(biddingValueMWT.toString(), "ether");
        console.log("Bidding Value in MWT in Wei: ", biddingValueMWT);
        return biddingValueMWT;
    } catch (error) {
        console.log("Error calculateBid: ", error);
        throw(error);
    }
}

async function findClosestCUDACorePerHourPrice(workerCUDACores) {
    //There is no simple dataframe/csv js package for easily doing this AFAIK
    //Expects the .csv to be stable sorted. By "CUDA Cores", then "Number of CPU's"

    return new Promise((res, rej) => {
        try {
            //Find the workers CPU Core Count. Save it somewhere
            const workerCPUCores = Math.floor(os.cpus().length/2);
            console.log("My CPU Core Count: ", workerCPUCores);

            let instanceComparisonFound = false;
            let foundCUDACoreMatch = false;
            let closestMatch;

            //We might need to take into accoutn of these instances accross all regions
            //Possibly find a mean accross them, by weighting them based of the amount of users approx in each region
            fs.createReadStream('./us_east_1.csv')
                .pipe(csv())
                .on('data', (currInstance) => {
                    //Always have a closest match
                    if(!closestMatch) closestMatch = currInstance;

                    let instanceCUDACores = parseInt(currInstance["CUDA Cores"]);
                    let instanceCPUCores = parseInt(currInstance["Number of CPUs"]);

                    let closestMatchCUDACores = parseInt(closestMatch["CUDA Cores"]);
                    let closestMatchCPUCores = parseInt(closestMatch["Number of CPUs"]);

                    // console.log("instance")
                    // console.log(currInstance);

                    //If current row is closer in CUDA cores but still less than yours, update closestMatch
                    if(instanceCUDACores < workerCUDACores && instanceCUDACores >= closestMatchCUDACores){
                        closestMatch = currInstance;
                    }

                    //If no exact CUDACore match, pick the next best AWS EC2 price
                    else if(instanceCUDACores > workerCUDACores && !foundCUDACoreMatch && !instanceComparisonFound){
                        closestMatch = currInstance;
                        instanceComparisonFound = true;
                    }

                    //If found instance with exact same amount of CUDA Cores
                    else if(instanceCUDACores === workerCUDACores){
                        if(!foundCUDACoreMatch){
                            closestMatch = currInstance;
                        }
                        //Is the # of CPU cores is closer to the workers CPU Core count, save as ref
                        else if(instanceCPUCores >= closestMatchCPUCores && instanceCPUCores <= workerCPUCores){
                            closestMatch = currInstance;
                        }
                        foundCUDACoreMatch = true;
                    }
                })
                .on('end', () => {
                    console.log("CLOSEST MATCH");
                    console.log(closestMatch);
                    // console.log("Price of CUDA Core per hour: ", closestMatch["Cost per CUDA Core per Hour"]);
                    res(parseFloat(closestMatch["Cost per CUDA Core per Hour"]))
                });
        } 
        catch (error) {
            console.log("Error findClosestCUDACorePerHourPrice: ", error);
            rej(error);
            throw(error);
        }
    })
}


module.exports = {calculateBid: calculateBid};