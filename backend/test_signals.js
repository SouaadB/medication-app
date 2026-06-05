const { analyzeAndSave } = require('./src/services/adherenceSignalService');

analyzeAndSave(25).then(result => {
    console.log('\n=== FORECAST RESULT ===');
    console.log('Risk level:    ', result.riskLevel);
    console.log('Forecast score:', result.forecastScore);
    console.log('\nActive signals:');
    result.activeSignals.forEach(s =>
        console.log(`  ✅ ${s.signal}: ${s.detail} (score: ${s.score})`)
    );
    console.log('\nAll signal scores:');
    Object.entries(result.signals).forEach(([key, s]) =>
        console.log(`  ${key}: ${s.score} — ${s.detail}`)
    );
}).catch(console.error);