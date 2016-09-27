# linagora.esn.mobile

Mobile Application Adapter Component for OpenPaaS ESN.

## Install

**1. Add component in the OpenPaaS ESN configuration file**

Add "linagora.esn.mobile" in config/default.json:

      "modules": [
        "linagora.esn.core.webserver",
        "linagora.esn.core.wsserver",
        "linagora.esn.mobile"
      ],

**3. Create symlink**

In your OpenPaaS ESN directory

    cd path_to_rse
    ln -s path_to_mobile modules/linagora.esn.mobile
