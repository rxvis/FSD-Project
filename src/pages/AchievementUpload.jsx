import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, ArrowLeft, FileText, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';

const AchievementUpload = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    const toDataUrl = (fileToConvert) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read selected file'));
        reader.readAsDataURL(fileToConvert);
    });

    const validateAndSetFile = (selectedFile) => {
        if (!selectedFile) return;
        if (!selectedFile.type.startsWith('image/')) {
            setError('Only image files are supported for proof upload.');
            return;
        }
        if (selectedFile.size > MAX_FILE_SIZE) {
            setError('File is too large. Maximum allowed size is 10MB.');
            return;
        }
        setError('');
        setFile(selectedFile);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.id || !file) return;

        try {
            setError('');
            setLoading(true);
            const proofDataUrl = await toDataUrl(file);
            await apiRequest('/api/achievements', {
                method: 'POST',
                body: JSON.stringify({
                    userId: user.id,
                    title: file.name,
                    description,
                    proofFileName: file.name,
                    proofDataUrl,
                }),
            });
            navigate('/proof-submissions');
        } catch (err) {
            setError(err.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft size={18} className="mr-1" /> Back
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Upload Achievement Proof</h1>
                <p className="text-slate-500 mb-8">Upload screenshots or certificates to verify your scores.</p>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${file ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => !file && document.getElementById('file-upload').click()}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => validateAndSetFile(e.target.files[0])}
                        />

                        {file ? (
                            <div className="flex flex-col items-center">
                                <FileText size={48} className="text-green-500 mb-2" />
                                <p className="font-medium text-slate-800">{file.name}</p>
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                    className="mt-4 text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                                >
                                    <X size={14} /> Remove File
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <UploadCloud size={48} className="text-slate-400 mb-2" />
                                <p className="font-medium text-slate-600">Click or drag file to upload</p>
                                <p className="text-sm text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            rows="3"
                            placeholder="Describe this achievement..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!file || loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        <UploadCloud size={18} />
                        {loading ? 'Submitting...' : 'Submit for Verification'}
                    </button>
                    {error && <p className="text-sm text-rose-500">{error}</p>}
                </form>
            </div>
        </div>
    );
};
export default AchievementUpload;
