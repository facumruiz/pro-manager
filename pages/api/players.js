import { mockPlayers } from '../../data/players';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(mockPlayers);
  }
  if (req.method === 'PATCH') {
    // In a real app this would update MongoDB
    // For demo purposes we return success
    return res.status(200).json({ message: 'Updated', id: req.query.id });
  }
  res.status(405).json({ message: 'Method not allowed' });
}
