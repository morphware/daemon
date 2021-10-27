#!/usr/bin/env python
# coding: utf-8

# In[1]:


import tensorflow as     tf
from   tensorflow import keras


# In[2]:


fashion_mnist = keras.datasets.fashion_mnist
(X_train_full, y_train_full), (X_test, y_test) = fashion_mnist.load_data()


# In[3]:


validation_set_size     = 5000
maximum_pixel_intensity = 255.0


# In[4]:


X_valid, X_train = X_train_full[:validation_set_size] / maximum_pixel_intensity, X_train_full[validation_set_size:] / maximum_pixel_intensity
y_valid, y_train = y_train_full[:validation_set_size], y_train_full[validation_set_size:]
X_test           = X_test / maximum_pixel_intensity


# In[5]:


# TODO Prepend the downloads directory and the broader path to this filename.

infile_pathname  = 'uploads/trainedModels/trained_model.h5'
model = keras.models.load_model(infile_pathname)


# In[9]:


def fn():
    return model.evaluate(X_test, y_test)[1]


# In[12]:


print(fn())


# In[ ]:





# In[ ]:





# In[ ]:




