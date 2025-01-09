import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { MathTrainer } from './MathTrainer';
import { TrainingConfig, TrainingConfiguration } from './TrainingConfig';

export type TrainingStats = {
    totalProblems: number;
    correctFirstTry: number;
    averageTimePerProblem: number;
    longestStreak: number;
    startTime: number;
    endTime: number | null;
}

export function TrainingSession() {
    const [isActive, setIsActive] = useState(false);
    const [config, setConfig] = useState<TrainingConfiguration | null>(null);
    const [stats, setStats] = useState<TrainingStats>({
        totalProblems: 0,
        correctFirstTry: 0,
        averageTimePerProblem: 0,
        longestStreak: 0,
        startTime: 0,
        endTime: null
    });

    const startSession = (newConfig: TrainingConfiguration) => {
        setConfig(newConfig);
        setIsActive(true);
        setStats({
            totalProblems: 0,
            correctFirstTry: 0,
            averageTimePerProblem: 0,
            longestStreak: 0,
            startTime: Date.now(),
            endTime: null
        });
    };

    const handleProblemComplete = (isFirstTry: boolean, streak: number) => {
        if (!config) return;

        setStats(prev => {
            const newStats = {
                ...prev,
                totalProblems: prev.totalProblems + 1,
                correctFirstTry: isFirstTry ? prev.correctFirstTry + 1 : prev.correctFirstTry,
                longestStreak: Math.max(prev.longestStreak, streak)
            };

            if (newStats.totalProblems === config.problemCount) {
                const endTime = Date.now();
                const totalTime = endTime - prev.startTime;
                return {
                    ...newStats,
                    endTime,
                    averageTimePerProblem: totalTime / config.problemCount
                };
            }

            return newStats;
        });
    };

    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (!isActive || !config) {
        return (
            <div className="container mx-auto p-4 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center text-3xl font-bold text-primary">Training Session</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TrainingConfig onStart={startSession} />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (stats.totalProblems === config.problemCount) {
        return (
            <div className="container mx-auto p-4 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center text-3xl font-bold text-primary">Session Complete!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-right font-bold">Total Problems:</div>
                                <div>{stats.totalProblems}</div>
                                <div className="text-right font-bold">Correct First Try:</div>
                                <div>{stats.correctFirstTry} ({Math.round(stats.correctFirstTry / stats.totalProblems * 100)}%)</div>
                                <div className="text-right font-bold">Longest Streak:</div>
                                <div>{stats.longestStreak}</div>
                                <div className="text-right font-bold">Total Time:</div>
                                <div>{formatTime(stats.endTime! - stats.startTime)}</div>
                                <div className="text-right font-bold">Average Time per Problem:</div>
                                <div>{formatTime(stats.averageTimePerProblem)}</div>
                            </div>
                            <Button onClick={() => setIsActive(false)} className="mt-6">Start New Session</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center text-3xl font-bold text-primary">
                        Training Session: {stats.totalProblems}/{config.problemCount}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <MathTrainer
                        onProblemComplete={handleProblemComplete}
                        allowedNumbers={config.selectedNumbers}
                    />
                </CardContent>
            </Card>
        </div>
    );
} 
