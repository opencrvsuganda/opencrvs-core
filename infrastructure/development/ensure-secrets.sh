# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.
#
# OpenCRVS is also distributed under the terms of the Civil Registration
# & Healthcare Disclaimer located at http://opencrvs.org/license.
#
# Copyright (C) The OpenCRVS Authors. OpenCRVS and the OpenCRVS
# graphic logo are (registered/a) trademark(s) of Plan International.
set -e

FILE=./.secrets/private-key.pem
if [ ! -f "$FILE" ]; then

    # Install OpenSSL if not exists
    if ! which openssl >/dev/null; then
      apk upgrade --update-cache --available
      apk add openssl
    fi

    rm -rf .secrets
    mkdir -p .secrets
    yarn dev:secrets:gen
fi

