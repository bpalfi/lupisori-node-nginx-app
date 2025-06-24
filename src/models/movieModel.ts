import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface for image asset
 * @interface IImageAsset
 */
interface IImageAsset {
  type: string;
  url: string;
  aspectRatio: number;
  height: number;
  width: number;
}

/**
 * Interface for external ID
 * @interface IExternalId
 */
interface IExternalId {
  source: string;
  id: string | number;
}

/**
 * Interface for parental rating
 * @interface IParentalRating
 */
interface IParentalRating {
  value: string;
  system: string;
  advisories?: string[];
}

/**
 * Interface for genre
 * @interface IGenre
 */
interface IGenre {
  id: any;
  title: string;
}

/**
 * Interface for localization
 * @interface ILocalization
 */
interface ILocalization {
  title: string;
  shortDescription: string;
  longDescription: string;
  imageAssets?: IImageAsset[];
}

/**
 * Interface representing a Movie document in MongoDB
 * @interface IMovie
 * @extends Document
 */
export interface IMovie extends Document {
  /** The unique identifier of the movie */
  id: string;
  /** The type of content */
  type: string;
  /** The title of the movie */
  title: string;
  /** A short description of the movie */
  shortDescription: string;
  /** A detailed description of the movie */
  longDescription: string;
  /** Array of image assets */
  images: IImageAsset[];
  /** Array of content providers */
  provider: string[];
  /** Provider-specific metadata */
  providerMetadata?: any;
  /** Array of genres */
  genres?: IGenre[];
  /** Array of external identifiers */
  externalIds?: IExternalId[];
  /** Array of parental ratings */
  parentalRatings?: IParentalRating[];
  /** Release year */
  releaseYear?: number;
  /** Release date timestamp */
  releaseDate?: number;
  /** Duration in minutes */
  duration?: number;
  /** Localized content in different languages */
  localization?: Record<string, ILocalization>;
}

/**
 * Mongoose schema for the Movie model
 * @constant MovieSchema
 */
const MovieSchema: Schema = new Schema(
  {
    id: String,
    type: String,
    title: String,
    shortDescription: String,
    longDescription: String,
    images: [
      {
        type: String,
        url: String,
        aspectRatio: Number,
        height: Number,
        width: Number
      }
    ],
    provider: [String],
    providerMetadata: Schema.Types.Mixed,
    genres: [
      {
        id: Schema.Types.Mixed,
        title: String
      }
    ],
    externalIds: [
      {
        source: String,
        id: Schema.Types.Mixed
      }
    ],
    parentalRatings: [
      {
        value: String,
        system: String,
        advisories: [String]
      }
    ],
    releaseYear: Number,
    releaseDate: Number,
    duration: Number,
    localization: Schema.Types.Mixed
  },
  {
    timestamps: true
  }
);

/**
 * Movie model for interacting with the movies collection in MongoDB
 * @constant Movie
 */
export const Movie = mongoose.model<IMovie>('Movie', MovieSchema, 'movie_active');
