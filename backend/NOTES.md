### Threshold Signature



### Data Pre-processor

Our back-end can probably automatically figure out what the training,
testing, and validation sets are by the size of the `ndarray` each one
of their respective variables point to.

Further, they all share common variable names, and we can probably fine
-tune this guessing; for lack of a better phrase, by downloading all of
the code on GitHub & beyond that depends on popular machine learning
libraries (e.g., `tensorflow`, `pytorch`, etc.) and running them through
GPT.

This is important because we need to split-up the training, testing, and
validation sets; to marginalize the risk of worker-nodes subjecting
themselves to intentional or accidental look-ahead bias / overfitting.

Otherwise, our users will have to use some sort of special designation,
or we will have to reserve keywords in Python; both of which are less
than ideal: as we want our users to have as seamless of an experience
as possible.

### WebRTC Vulnerability

"In January 2015, TorrentFreak reported a serious security flaw in 
browsers that support WebRTC, saying that it compromised the security of
VPN tunnels by exposing the true IP address of a user."

"...(however the uBlock Origin add-on can fix this problem). As of 
September 2019, this WebRTC flaw still surfaces on Firefox 69.x and 
still by default exposes the user's internal IP address to the web."

--Wikipedia
