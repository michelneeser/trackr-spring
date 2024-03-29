document.addEventListener("DOMContentLoaded", function() {
    let token = document.querySelector("#token").value;

    let addStatValue = function() {
        let valueToAdd = document.querySelector("#valueToAdd").value;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.status == 201 && this.readyState == 4) {
                location.href = "http://localhost:8080/stats/" + token;
            }
        };
        xhr.open("POST", "http://localhost:8080/stats/api/" + token + "/values");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({
            "value": valueToAdd
        }));
    };

    document.querySelector("#addValue").addEventListener("click", function() {
        addStatValue();
    });

    document.querySelector("#valueToAdd").addEventListener("keypress", function(e) {
        if (e.key === 'Enter') {
            addStatValue();
        }
    });

    let setStatName = function() {
        let statName = document.querySelector("#statName").value;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.status == 200 && this.readyState == 4) {
                location.href = "http://localhost:8080/stats/" + token;
            }
        };
        xhr.open("PUT", "http://localhost:8080/stats/api/" + token);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({
            "name": statName
        }));
    };

    document.querySelector("#setStatName").addEventListener("click", function() {
       setStatName();
    });

    document.querySelector("#statName").addEventListener("keypress", function(e) {
        if (e.key === 'Enter') {
            setStatName();
        }
    });

    document.querySelectorAll(".delete-value").forEach(function(btn) {
        btn.addEventListener("click", function() {
            let valueId = this.closest("tr").dataset.valueid;
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.status == 200 && this.readyState == 4) {
                    location.href = "http://localhost:8080/stats/" + token;
                }
            };
            xhr.open("DELETE", "http://localhost:8080/stats/api/" + token + "/values/" + valueId);
            xhr.send();
        });
    });

    $('#reallyDeleteStatModal').on('show.bs.modal', function (e) {
        let removeStat = function() {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.status == 200 && this.readyState == 4) {
                    location.href = "http://localhost:8080/stats/";
                }
            };
            xhr.open("DELETE", "http://localhost:8080/stats/api/" + token);
            xhr.send();
        };

        document.querySelector("#deleteStat").addEventListener("click", removeStat);
    });

    $('#reallyDeleteValueModal').on('show.bs.modal', function (e) {
        let removeSelectedValue = function() {
            let valueId = e.relatedTarget.closest("tr").dataset.valueid;
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.status == 200 && this.readyState == 4) {
                    location.href = "http://localhost:8080/stats/" + token;
                }
            };
            xhr.open("DELETE", "http://localhost:8080/stats/api/" + token + "/values/" + valueId);
            xhr.send();
        };

        document.querySelector("#deleteValue").addEventListener("click", removeSelectedValue);
    });

    // render chart
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.status == 200 && this.readyState == 4) {
            let response = JSON.parse(this.responseText);

            if (response.numeric) {
                let xhrForValues = new XMLHttpRequest();
                xhrForValues.onreadystatechange = function() {
                    if (this.status == 200 && this.readyState == 4) {
                        let responseForValues = JSON.parse(this.responseText);

                        let chartCanvas = document.createElement("canvas");
                        chartCanvas.setAttribute("id", "chartCanvas");
                        document.querySelector("#chart").appendChild(chartCanvas);

                        let labels = [], data = [];
                        for (const statValue of responseForValues._embedded.statValueList) {
                            labels.push(moment(statValue.createDate).format('L LTS'));
                            data.push(statValue.value);
                        }

                        let context = chartCanvas.getContext("2d");
                        new Chart(context, {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: [{
                                    borderColor: 'rgb(255,14,17)',
                                    data: data
                                }]
                            },
                            options: {
                                legend: {
                                    display: false
                                }
                            }
                        });
                    }
                };
                xhrForValues.open("GET", response._links.values.href);
                xhrForValues.send();
            }
        }
    };
    xhr.open("GET", "http://localhost:8080/stats/api/" + token);
    xhr.send();
});