#!/usr/bin/env python3

import json
import requests


class URI:

    def __init__(self):
        self.scheme   = 'http'
        if self.scheme != 'http':
            # TODO May be some SSL-related parameterization in `cloudinfo`'s set-up script that needs to be done
            pass
        self.endpoint = self.scheme+'://'+'localhost:8000/api/v1'


class C:

    def __init__(self):
        self.endpoint = URI().endpoint

    def get_gpu_instance_prices(self,provider,service,region):
        """uri = self.endpoint\
                +f'/providers/{provider}'\
                +f'/services/{service}'\
                +f'/regions/{region}'\
                +f'/products'"""
        uri = 'http://localhost:8000/api/v1/providers/amazon/services/compute/regions/us-east-1/products'
        metadata = json.loads(requests.get(uri).text)
        l = []
        for instanceType in metadata['products']:
            if instanceType.get('gpusPerVm') > 0:
                l.append(instanceType)
        return l


if __name__ == '__main__':
    from pprint import pprint
    c = C()
    c.get_gpu_instance_prices('amazon','compute','us-east-1')
