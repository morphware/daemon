#!/usr/bin/env python3
# coding: utf-8

# In[1]:

import tensorflow as     tf
from   tensorflow import keras
import zipfile

def load_mnist(path, kind):
    import os
    import gzip
    import numpy as np

    """Load MNIST data from `path`"""
    labels_path = os.path.join(path,
                               '%s-labels-idx1-ubyte.gz'
                               % kind)
    images_path = os.path.join(path,
                               '%s-images-idx3-ubyte.gz'
                               % kind)

    with gzip.open(labels_path, 'rb') as lbpath:
        labels = np.frombuffer(lbpath.read(), dtype=np.uint8,
                               offset=8)

    with gzip.open(images_path, 'rb') as imgpath:
        images = np.frombuffer(imgpath.read(), dtype=np.uint8,
                               offset=16).reshape(len(labels), 784)

    return images, labels

# In[2]:

# fashion_mnist = keras.datasets.fashion_mnist
# (X_train_full, y_train_full), (X_test, y_test) = fashion_mnist.load_data()
X_test, y_test   = load_mnist('unsorted/testing-data', 't10k')

# In[3]:


validation_set_size     = 5000
maximum_pixel_intensity = 255.0


# In[4]:
# X_valid, X_train = X_train_full[:validation_set_size] / maximum_pixel_intensity, X_train_full[validation_set_size:] / maximum_pixel_intensity
# y_valid, y_train = y_train_full[:validation_set_size], y_train_full[validation_set_size:]
X_test           = X_test / maximum_pixel_intensity


# In[5]:


# TODO Prepend the downloads directory and the broader path to this filename.
# TODO Merge Validator_node.py with Sample_Image_Classification. The node
# (worker/validator) should know how to run the model, and which dataset 
# (training/testing) to use
infile_pathname  = 'unsorted/uploads/trainedModels/trained_model.h5'
model = keras.models.load_model(infile_pathname)


# In[9]:


def fn():
    return model.evaluate(X_test, y_test)[1]


# In[12]:


print(fn())


# In[ ]:





# In[ ]:





# In[ ]:




