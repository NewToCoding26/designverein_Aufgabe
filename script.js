let http;
        function init() {
            http = new XMLHttpRequest();
            const url = 'https://azubi.dv-test.de/search/';
            http.open('POST', url, true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            http.onreadystatechange = function () {
                if (http.readyState == 4 && http.status == 200) {
                    showResult(JSON.parse(http.responseText));
                }
            }
        }

        function getData() {
            init();
            let params = '{"user": "api_azubi_test","password": "dUb0SkqWH6MHXSsBAKkHmvJa","field": "city","criteria": "berlin","condition": "like"}';
            http.send(params);
        }

        function showResult(data) {
            console.log(data);
        }