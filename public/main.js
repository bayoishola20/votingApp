const form = document.getElementById('vote-form');

// Submit form

form.addEventListener('submit', e => {
    // Check local storage if "hasVoted"
    if(window.localStorage.getItem('hasVoted')) {
        $('#hasVotedAlreadyErrorMsg').removeClass('hidden');
        e.preventDefault();
    } else {
        // Set localStorage to show voted already
        window.localStorage.setItem('hasVoted', true)

        const choice = document.querySelector('input[name=party]:checked').value;
        const data = { party: choice };

        fetch('http://voting-ng.herokuapp.com/poll', {
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
    }
});

// Submit form ends

fetch('http://voting-ng.herokuapp.com/poll')
    .then(res => res.json())
    .then(data => {
        const votes = data.votes;
        document.querySelector('#chartTitle').textContent = `Pseudo-election results: ${votes.length} votes in total`;

        // Dynamic Chart Title
        // Refresh the Total Votes every second
        setInterval(() => {
            fetch('http://voting-ng.herokuapp.com/poll')
            .then(res => res.json())
            .then(data => document.querySelector('#chartTitle').textContent = `Pseudo-election results: ${votes.length} votes in total`)
            .catch(err => console.log(err));
        }, 1000);

        //Vote count - acc/current
        const voteCounts = votes.reduce(
            (acc, vote) => (
            (acc[vote.party] = (acc[vote.party] || 0) + parseInt(vote.points)), acc
            ),
            {}
        );

        // Set initial Data Points Values to 0
        if (Object.keys(voteCounts).length === 0 && voteCounts.constructor === Object) {
            voteCounts.PDP = 0;
            voteCounts.APC = 0;
            voteCounts.APGA = 0;
        }


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
                legend:{
                    fontFamily: "Bellefair",
                   },
                data: [
                    {
                        type: 'pie',
                        dataPoints: dataPoints,
                        showInLegend: true,
                        indexLabelFontFamily: 'Bellefair',
                        indexLabelFontStyle: 'italic'
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