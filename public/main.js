const form = document.getElementById('vote-form');

// Submit form

form.addEventListener('submit', e => {
    const choice = document.querySelector('input[name=party]:checked').value;
    const data = { party: choice };

    fetch('http://localhost:4343/poll', {
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));

    e.preventDefault();
});

// Submit form

fetch('http://localhost:4343/poll')
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        const votes = data.votes;
        //Vote count - acc/current
        const voteCounts = votes.reduce(
            (acc, vote) => (
              (acc[vote.party] = (acc[vote.party] || 0) + parseInt(vote.points)), acc
            ),
            {}
        );


        let dataPoints = [
            { label: 'PDP', y: voteCounts.PDP, legendText: 'PDP' },
            { label: 'APC', y: voteCounts.APC, legendText: 'APC' },
            { label: 'APGA', y: voteCounts.APGA, legendText: 'APGA' }
        ];
        
        const chartContainer = document.getElementById('chartContainer');
        
        if (chartContainer) {
            const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                theme: 'theme3',
                title: {
                    text: `Pseudo-election results: ${votes.length} votes in total`,
                    fontWeight: "bolder",
                    fontColor: "whitesmoke",
                    fontSize: 15,
                    padding: 10
                },
                data: [
                    {
                        type: 'pie',
                        dataPoints: dataPoints,
                        showInLegend: true,
                    }
                ]
            });
            chart.render();
        
        
            // Enable pusher logging - don't include this in production
            Pusher.logToConsole = true;
        
            let pusher = new Pusher('0b8806dddaba260eed07', {
              cluster: 'ap1',
              encrypted: true
            });
        
            let channel = pusher.subscribe('voting-application');
            channel.bind('political-parties', function(data) {
              dataPoints = dataPoints.map(x => {
                  if(x.label == data.party) {
                    x.y += data.points;
                    return x;
                  } else {
                      return x;
                  }
              });
              chart.render();
            });
        }
    });