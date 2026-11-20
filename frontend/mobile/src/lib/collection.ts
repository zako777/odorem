export type Possession = {
  id: string;
  productId: string;
  quantity: number;
  condition: string;
  rating: number | null;
  comment: string | null;
};

export type CollectionEntry = {
  possession: Possession;
  perfumeName: string;
  brand: string;
  concentrationCode: string;
  volumeMl: number;
};

export type CollectionPage = {
  items: CollectionEntry[];
  total: number;
  page: number;
  perPage: number;
};

export const POSSESSION_CONDITIONS = ["new", "opened", "finished"] as const;

export const CONDITION_LABELS: Record<string, string> = {
  new: "Neuf",
  opened: "Ouvert",
  finished: "Terminé",
};

export const MY_COLLECTION_QUERY = `
  query MyCollection($page: Int, $perPage: Int) {
    myCollection(page: $page, perPage: $perPage) {
      items {
        possession { id productId quantity condition rating comment }
        perfumeName
        brand
        concentrationCode
        volumeMl
      }
      total
      page
      perPage
    }
  }
`;

export const UPDATE_POSSESSION_MUTATION = `
  mutation UpdatePossession($possessionId: Int!, $input: UpdatePossessionInput!) {
    updatePossession(possessionId: $possessionId, input: $input) {
      id
      quantity
      condition
      rating
      comment
    }
  }
`;

export const REMOVE_POSSESSION_MUTATION = `
  mutation RemovePossession($possessionId: Int!) {
    removePossession(possessionId: $possessionId)
  }
`;
