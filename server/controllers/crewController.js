import Crew from '../models/Crew.js';

export const getCrews = async (req, res, next) => {
  try {
    const crews = await Crew.find().sort({ createdAt: 1 });
    res.json(crews);
  } catch (error) {
    next(error);
  }
};

export const createCrew = async (req, res, next) => {
  try {
    const { name, slug, carName, tagline, image, colorPrimary, colorSecondary } = req.body;
    
    if (!name || !colorPrimary) {
      res.status(400);
      throw new Error('Crew name and primary color are required');
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const newCrew = await Crew.create({
      name,
      slug: generatedSlug,
      carName: carName || `${name}'s High-Speed Racer`,
      tagline: tagline || 'Speed, precision, and championship drive',
      image: image || '/assets/crews/mcqueen.png',
      colorPrimary: colorPrimary || '#ef4444',
      colorSecondary: colorSecondary || '#f59e0b',
      totalPoints: 0,
      memberCount: 0
    });

    res.status(201).json(newCrew);
  } catch (error) {
    next(error);
  }
};

export const updateCrew = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, carName, tagline, image, colorPrimary, colorSecondary, totalPoints, memberCount } = req.body;

    const crew = await Crew.findById(id);
    if (!crew) {
      res.status(404);
      throw new Error('Crew constructor not found');
    }

    if (name) crew.name = name;
    if (slug) crew.slug = slug;
    if (carName !== undefined) crew.carName = carName;
    if (tagline !== undefined) crew.tagline = tagline;
    if (image !== undefined) crew.image = image;
    if (colorPrimary) crew.colorPrimary = colorPrimary;
    if (colorSecondary) crew.colorSecondary = colorSecondary;
    if (totalPoints !== undefined) crew.totalPoints = totalPoints;
    if (memberCount !== undefined) crew.memberCount = memberCount;

    const updated = await crew.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteCrew = async (req, res, next) => {
  try {
    const { id } = req.params;
    const crew = await Crew.findByIdAndDelete(id);
    if (!crew) {
      res.status(404);
      throw new Error('Crew constructor not found');
    }
    res.json({ message: `Crew "${crew.name}" deleted successfully.` });
  } catch (error) {
    next(error);
  }
};
