import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

const STORAGE_KEY = 'math-trainer-config';

export interface TrainingConfiguration {
    problemCount: number;
    selectedNumbers: number[];
}

interface TrainingConfigProps {
    onStart: (config: TrainingConfiguration) => void;
}

const getStoredConfig = (): TrainingConfiguration => {
    const storedConfig = localStorage.getItem(STORAGE_KEY);
    if (storedConfig) {
        return JSON.parse(storedConfig);
    }
    return {
        problemCount: 50,
        selectedNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
};

export function TrainingConfig({ onStart }: TrainingConfigProps) {
    const [problemCount, setProblemCount] = useState(() => getStoredConfig().problemCount);
    const [selectedNumbers, setSelectedNumbers] = useState<number[]>(() => getStoredConfig().selectedNumbers);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            problemCount,
            selectedNumbers
        }));
    }, [problemCount, selectedNumbers]);

    const toggleNumber = (num: number) => {
        if (selectedNumbers.includes(num)) {
            setSelectedNumbers(prev => prev.filter(n => n !== num));
        } else {
            setSelectedNumbers(prev => [...prev, num].sort((a, b) => a - b));
        }
    };

    const handleStart = () => {
        if (selectedNumbers.length === 0) {
            alert('Please select at least one number');
            return;
        }
        onStart({
            problemCount,
            selectedNumbers
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-2">Number of Problems</label>
                <Input
                    type="number"
                    min={1}
                    max={100}
                    value={problemCount}
                    onChange={(e) => setProblemCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    className="w-full"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">Select Multiplication Tables</label>
                <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 15 }, (_, i) => i + 1).map(num => (
                        <Card
                            key={num}
                            className={`p-4 text-center cursor-pointer transition-colors ${selectedNumbers.includes(num)
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-secondary'
                                }`}
                            onClick={() => toggleNumber(num)}
                        >
                            {num}
                        </Card>
                    ))}
                </div>
            </div>
            <Button onClick={handleStart} size="lg" className="w-full">
                Start Training Session
            </Button>
        </div>
    );
} 
