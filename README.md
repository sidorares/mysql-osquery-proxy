mysql-osquery-proxy
==============

mysql to [osquery](https://github.com/facebook/osquery) proxy server

## Installation

    npm install mysql-osquery-proxy

## Usage

    node proxy.js mysql-listen-port pg-connect-string

## Example

```
➜  ~  /usr/local/mysql/bin/mysql -h 127.0.0.1 -P 3307
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 0
Server version: osquery mysql interface

Copyright (c) 2000, 2015, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> select name from apps where name like "%rome%";
+--------------------------+
| name                     |
+--------------------------+
| Google Chrome Canary.app |
| Google Chrome.app        |
+--------------------------+
2 rows in set (0.14 sec)

mysql>
```


## see also
 - [mysql to postgres proxy](https://github.com/sidorares/mysql-pg-proxy)
 - [osquery interface using PG Foreign Data Wrappers](https://github.com/shish/pgosquery)
