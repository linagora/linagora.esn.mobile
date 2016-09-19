# linagora.esn.push

Push Notification component for OpenPaaS ESN.

## Install

**1. Clone linagora.esn.push**

Clone somewhere, the 2 following git repository:

 * https://ci.open-paas.org/stash/projects/OM/repos/linagora.esn.rse/browse
 * https://ci.open-paas.org/stash/projects/OM/repos/linagora.esn.push/browse

Go inside linagora.esn.rse repo and run:

    npm install
    npm link

Go inside linagora.esn.push and run:

    npm link linagora-rse
    npm install

**2. Add component in the configuration file**

Add "linagora.esn.push" in config/default.json:

      "modules": [
        "linagora.esn.core.webserver",
        "linagora.esn.core.wsserver",
        "linagora.esn.push"
      ],

**3. Create symlink**

In your OpenPaaS ESN directory

    cd path_to_rse
    ln -s path_to_push modules/linagora.esn.push
