class DbUpdateStatus {
  _ref;
  _clients;

  _init(db) {
    console.log("this will be called only once");
    this.ref = db.ref("/orders");
    this._clients = [];
    this.ref.on("child_changed", (snapshot) => {
      try {
        const data = snapshot.val();

        const changedData = snapshot.val();
        const changedKey = snapshot.key;

        const message = `data: ${changedKey}###${changedData.status}###${
          changedData?.deliveredAt ?? ""
        }\n\n`;

        this._clients.forEach((client) => client.write(message));
      } catch (err) {
        console.log("Error while reading on child_changed", err);
      }
    });
  }

  _off() {
    _res.off();
  }

  _subscribe(client) {
    console.log("subscribe to update");
    this._clients.push(client);
  }
  _unSubscribe(client) {
    console.log("unsubscribe to change");
    const index = this._clients.indexOf(client);
    if (index !== -1) {
      this._clients.splice(index, 1);
    }
  }
}

module.exports = { DbUpdateStatus };
