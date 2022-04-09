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

FARAJALAND_DIR=$1
HOST_FARAJALAND_PATH=$2

# Install Docker if not exists
if ! which docker >/dev/null; then
  apk upgrade --update-cache --available
  apk add docker
fi

DATABASE_EXISTS=$(docker run --rm --network=opencrvs_default mongo:4.4 mongo --host mongo1 --eval 'db.getMongo().getDBNames().indexOf("hearth-dev")' --quiet)

if [ $DATABASE_EXISTS -lt 0 ]; then
    echo "hearth-dev database does not exist, seeding database"

    cd $FARAJALAND_DIR
    yarn db:clear:all
    DIR=$HOST_FARAJALAND_PATH yarn db:backup:restore
else
    echo "database already seeded"
fi

