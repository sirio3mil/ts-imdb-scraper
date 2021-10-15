/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface TapeUserHistoryDetailPartialInput {
  createdAt?: Nullable<DateTime>;
  exported?: Nullable<boolean>;
  place?: Nullable<PlaceID>;
  tapeUserHistoryDetailId?: Nullable<number>;
  updatedAt?: Nullable<DateTime>;
  visible?: Nullable<boolean>;
}

export interface TvShowPartialInput {
  createdAt?: Nullable<DateTime>;
  finished?: Nullable<boolean>;
  tape?: Nullable<TapeID>;
}

export interface Country {
  countryId: string;
  createdAt: DateTime;
  isoCode?: Nullable<string>;
  language?: Nullable<Language>;
  officialName: string;
}

export interface File {
  createdAt: DateTime;
  deletedAt?: Nullable<DateTime>;
  extension: string;
  fileId: string;
  fileType: FileType;
  image: Image;
  isDeleted: boolean;
  mime: string;
  name: string;
  object: GlobalUniqueObject;
  path: string;
  season?: Nullable<FileSeason>;
  size: number;
  url: string;
}

export interface FileSeason {
  file: File;
  season: number;
}

export interface FileType {
  description: string;
  fileTypeId: string;
}

export interface Genre {
  createdAt: DateTime;
  genreId: string;
  name: string;
}

export interface GlobalUniqueObject {
  cover?: Nullable<File>;
  files?: Nullable<File[]>;
  imdbNumber?: Nullable<ImdbNumber>;
  objectId: string;
  people?: Nullable<People>;
  permanentLink: PermanentLink;
  ranking?: Nullable<Ranking>;
  rowType: RowType;
  searchValue?: Nullable<SearchValue>;
  searchValues?: Nullable<SearchValue[]>;
  tape?: Nullable<Tape>;
  thumbnail?: Nullable<File>;
}

export interface Image {
  file: File;
  height: number;
  width: number;
}

export interface ImdbNumber {
  imdbNumber: number;
  object: GlobalUniqueObject;
  url?: Nullable<string>;
}

export interface Language {
  createdAt: DateTime;
  languageId: string;
  name: string;
}

export interface Location {
  createdAt: DateTime;
  locationId: string;
  place: string;
}

export interface OauthUser {
  firstName?: Nullable<string>;
  lastName?: Nullable<string>;
  user: User;
}

export interface People {
  alias: PeopleAlias;
  aliases?: Nullable<PeopleAlias[]>;
  createdAt: DateTime;
  detail?: Nullable<PeopleDetail>;
  fullName: string;
  object: GlobalUniqueObject;
  peopleId: string;
}

export interface PeopleAlias {
  alias: string;
  people: People;
  peopleAliasId: string;
}

export interface PeopleAliasTape {
  createdAt: DateTime;
  peopleAlias: PeopleAlias;
  peopleAliasTapeId: string;
  tape: Tape;
}

export interface PeopleDetail {
  birthDate?: Nullable<DateTime>;
  birthPlace?: Nullable<string>;
  country?: Nullable<Country>;
  createdAt: DateTime;
  deathDate?: Nullable<DateTime>;
  deathPlace?: Nullable<string>;
  gender?: Nullable<string>;
  havePhoto: boolean;
  height?: Nullable<number>;
  people: People;
  skip: boolean;
  updatedAt: DateTime;
}

export interface PermanentLink {
  object: GlobalUniqueObject;
  url: string;
}

export interface Place {
  description: string;
  placeId: string;
}

export interface PlacePage {
  elements?: Nullable<Nullable<Place>[]>;
  pages?: Nullable<number>;
  total?: Nullable<number>;
}

export interface Premiere {
  country?: Nullable<Country>;
  createdAt: DateTime;
  date: DateTime;
  detail?: Nullable<PremiereDetail>;
  details?: Nullable<PremiereDetail[]>;
  place: string;
  premiereId: string;
  tape: Tape;
}

export interface PremiereDetail {
  createdAt: DateTime;
  observation: string;
  premiere: Premiere;
  premiereDetailId: string;
}

export interface Producer {
  country?: Nullable<Country>;
  name: string;
  producerId: string;
}

export interface Ranking {
  calculatedScore: number;
  object: GlobalUniqueObject;
  score: number;
  votes: number;
}

export interface Role {
  role: string;
  roleId: string;
}

export interface RowType {
  description: string;
  rowTypeId: string;
}

export interface SearchValue {
  object: GlobalUniqueObject;
  primaryParam: boolean;
  searchParam: string;
  searchValueId: string;
  slug: string;
}

export interface Sound {
  createdAt: DateTime;
  description: string;
  soundId: string;
}

export interface Tag {
  createdAt: DateTime;
  keyword: string;
  tagId: string;
}

export interface Tape {
  aliases?: Nullable<PeopleAliasTape[]>;
  certification?: Nullable<TapeCertification>;
  certifications?: Nullable<TapeCertification[]>;
  countries: Country[];
  createdAt: DateTime;
  default?: Nullable<TapeDefaultValue>;
  detail?: Nullable<TapeDetail>;
  genres: Genre[];
  languages?: Nullable<Language[]>;
  locations: Location[];
  object: GlobalUniqueObject;
  originalTitle: string;
  people?: Nullable<TapePeopleRole[]>;
  peopleAliasTape?: Nullable<PeopleAliasTape>;
  plot?: Nullable<TapePlot>;
  premiere?: Nullable<Premiere>;
  premieres?: Nullable<Premiere[]>;
  producers: Producer[];
  sounds: Sound[];
  tags: Tag[];
  tapeId: string;
  tapePeopleRole?: Nullable<TapePeopleRole>;
  tapeUser?: Nullable<TapeUser>;
  title?: Nullable<TapeTitle>;
  titles?: Nullable<TapeTitle[]>;
  tvShow?: Nullable<TvShow>;
  tvShowChapter?: Nullable<TvShowChapter>;
  users: TapeUser[];
}

export interface TapeCertification {
  certification?: Nullable<string>;
  country?: Nullable<Country>;
  createdAt: DateTime;
  tape: Tape;
  tapeCertificationId: string;
}

export interface TapeDefaultValue {
  cast?: Nullable<People>;
  country?: Nullable<Country>;
  director?: Nullable<People>;
  tape: Tape;
  title: SearchValue;
}

export interface TapeDetail {
  budget: number;
  color?: Nullable<string>;
  createdAt: DateTime;
  currency: number;
  duration?: Nullable<number>;
  hasCover: boolean;
  isAdult: boolean;
  isTvShow: boolean;
  isTvShowChapter: boolean;
  tape: Tape;
  updatedAt: DateTime;
  year?: Nullable<number>;
}

export interface TapePeopleRole {
  character?: Nullable<TapePeopleRoleCharacter>;
  createdAt: DateTime;
  people: People;
  role: Role;
  tape: Tape;
  tapePeopleRoleId: string;
}

export interface TapePeopleRoleCharacter {
  character: string;
  createdAt: DateTime;
  tapePeopleRole: TapePeopleRole;
}

export interface TapePlot {
  plot: string;
  tape: Tape;
}

export interface TapeTitle {
  country?: Nullable<Country>;
  language?: Nullable<Language>;
  observations?: Nullable<string>;
  tape: Tape;
  tapeTitleId: string;
  title: string;
}

export interface TapeUser {
  createdAt: DateTime;
  history: TapeUserHistory[];
  historyByStatus?: Nullable<TapeUserHistory>;
  score?: Nullable<TapeUserScore>;
  tape: Tape;
  tapeUserId: string;
  user: User;
}

export interface TapeUserHistory {
  createdAt: DateTime;
  deletedAt?: Nullable<DateTime>;
  details: TapeUserHistoryDetail[];
  isDeleted: boolean;
  tapeUser: TapeUser;
  tapeUserHistoryId: string;
  tapeUserStatus?: Nullable<TapeUserStatus>;
  updatedAt: DateTime;
}

export interface TapeUserHistoryDetail {
  createdAt: DateTime;
  exported: boolean;
  place?: Nullable<Place>;
  tapeUserHistory: TapeUserHistory;
  tapeUserHistoryDetailId: string;
  updatedAt: DateTime;
  visible: boolean;
}

export interface TapeUserPage {
  elements?: Nullable<Nullable<TapeUser>[]>;
  pages?: Nullable<number>;
  total?: Nullable<number>;
}

export interface TapeUserScore {
  createdAt: DateTime;
  exported: boolean;
  score: number;
  tapeUser: TapeUser;
}

export interface TapeUserStatus {
  description: string;
  tapeUserStatusId: string;
}

export interface TapeUserStatusPage {
  elements?: Nullable<Nullable<TapeUserStatus>[]>;
  pages?: Nullable<number>;
  total?: Nullable<number>;
}

export interface TvShow {
  chapters?: Nullable<TvShowChapter[]>;
  chaptersBySeason?: Nullable<TvShowChapter[]>;
  createdAt: DateTime;
  finished: boolean;
  lastChapter?: Nullable<TvShowChapter>;
  summaries: TvShowChapterSummary[];
  summaryByUser?: Nullable<TvShowChapterSummary>;
  tape: Tape;
}

export interface TvShowChapter {
  chapter?: Nullable<number>;
  createdAt: DateTime;
  season?: Nullable<number>;
  tape: Tape;
  tvShow: TvShow;
}

export interface TvShowChapterSummary {
  importedChapter?: Nullable<TvShowChapter>;
  tvShow: TvShow;
  user: User;
  viewedChapter?: Nullable<TvShowChapter>;
}

export interface User {
  createdAt: DateTime;
  oauthUser: OauthUser;
  token?: Nullable<string>;
  updatedAt: DateTime;
  userId: string;
  username: string;
  wishList: WishList[];
}

export interface WishList {
  tape: Tape;
  tapeUser: TapeUser;
  tapeUserHistory: TapeUserHistory;
  tapeUserStatus: TapeUserStatus;
  user: User;
}

export interface IMutation {
  createFile(
    file: Upload,
    globalUniqueObjectId: GlobalUniqueObjectID
  ): File | Promise<File>;
  deleteTapeUserHistory(
    tapeUserHistoryId: TapeUserHistoryID
  ): TapeUser | Promise<TapeUser>;
  editSeasonUser(
    season: number,
    tapeUserStatusId: TapeUserStatusID,
    tvShowId: TvShowID,
    userId: UserID,
    placeId?: Nullable<PlaceID>
  ): Nullable<TapeUser>[] | Promise<Nullable<TapeUser>[]>;
  editTapeUser(
    tapeId: TapeID,
    tapeUserStatusId: TapeUserStatusID,
    userId: UserID,
    placeId?: Nullable<PlaceID>
  ): TapeUser | Promise<TapeUser>;
  editTapeUserHistoryDetail(
    input: TapeUserHistoryDetailPartialInput,
    tapeUserHistoryDetailId: TapeUserHistoryDetailID
  ): TapeUserHistoryDetail | Promise<TapeUserHistoryDetail>;
  editTvShow(input: TvShowPartialInput): TvShow | Promise<TvShow>;
  importFile(
    globalUniqueObjectId: GlobalUniqueObjectID,
    url: string,
    fileTypeId?: Nullable<FileTypeID>
  ): GlobalUniqueObject | Promise<GlobalUniqueObject>;
  importImdbEpisodes(
    imdbNumber: number,
    seasonNumber: number
  ): Nullable<TvShowChapter>[] | Promise<Nullable<TvShowChapter>[]>;
  importImdbMovie(imdbNumber: number): Tape | Promise<Tape>;
}

export interface IQuery {
  listPlace(page: number, pageSize: number): PlacePage | Promise<PlacePage>;
  listTapeUser(
    page: number,
    pageSize: number,
    userId: UserID,
    finished?: Nullable<boolean>,
    isTvShow?: Nullable<boolean>,
    placeId?: Nullable<PlaceID>,
    tapeUserStatusId?: Nullable<TapeUserStatusID>,
    visible?: Nullable<boolean>
  ): TapeUserPage | Promise<TapeUserPage>;
  listTapeUserStatus(
    page: number,
    pageSize: number
  ): TapeUserStatusPage | Promise<TapeUserStatusPage>;
  listTvShowChapter(
    season: number,
    tvShowId: TvShowID
  ): Nullable<TvShowChapter>[] | Promise<Nullable<TvShowChapter>[]>;
  login(password: string, username: string): User | Promise<User>;
  search(
    page: number,
    pageSize: number,
    pattern: string,
    rowType?: Nullable<number>
  ): Nullable<SearchValue>[] | Promise<Nullable<SearchValue>[]>;
  tape(tapeId?: Nullable<TapeID>): Tape | Promise<Tape>;
}

export type DateTime = any;
export type TapeUserStatusID = any;
export type UserID = any;
export type PeopleID = any;
export type RoleID = any;
export type PeopleAliasID = any;
export type CountryID = any;
export type TapeID = any;
export type PlaceID = any;
export type TvShowID = any;
export type TapeUserHistoryDetailID = any;
export type GlobalUniqueObjectID = any;
export type FileTypeID = any;
export type Upload = any;
export type TapeUserHistoryID = any;
type Nullable<T> = T | null;
