import type { Move } from "@primechess/chess-lib";
import { ApiService } from "~/services/ApiService";

type MoveEvent = {
    event: "move";
    move: { from: string; to: string };
    ply: number;
};

export function useChessOnline(gameId: string) {
    const store = useChessStore();
    const core = useChessCore();

    let unsubscribe: (() => void) | null = null;
    const playerIndex = ref<number | undefined>(undefined);
    const canMove = computed<boolean>(() => core.canMove.value && playerIndex.value === core.activePlayerIndex.value);

    let isLoaded = false;
    let pendingEvents: MoveEvent[] = [];

    onMounted(async () => {
        try {
            unsubscribe = await ApiService.subscribe(gameId, (data: any) => {
                if (data?.event !== "move") return;
                if (!isLoaded) {
                    pendingEvents.push(data);
                    return;
                }
                applyMoveEvent(data);
            });

            await sync();
            core.playerInFrontIndex.value = playerIndex.value ?? 0;
        } catch (error) {
            console.error("Failed to join game.", error);
            navigateTo("/");
        }
    });

    onUnmounted(() => {
        unsubscribe?.();
    });

    async function sync(): Promise<void> {
        isLoaded = false;
        const data = await ApiService.joinGame(gameId);
        playerIndex.value = data.playerIndex;
        core.loadState(data.state);
        store.storeGame("online", { id: data.gameId, state: data.state });
        isLoaded = true;

        const queued = pendingEvents;
        pendingEvents = [];
        queued.forEach(applyMoveEvent);
    }

    function applyMoveEvent(data: MoveEvent): void {
        const playedHalfmoves: number = core.algebraicMoves.value.length;

        if (data.ply <= playedHalfmoves) return;

        if (data.ply > playedHalfmoves + 1) {
            sync().catch((error) => console.error("Failed to resync game.", error));
            return;
        }

        const move: Move | null = core.tryMove(data.move.from, data.move.to);
        if (move) store.storeMove(move);
    }

    async function tryMove(from: string, to: string): Promise<void> {
        try {
            await ApiService.move(gameId, { from, to });
        } catch (error) {
            console.error("Failed to play move.", error);
        }
    }

    return {
        ...core,
        playerIndex,
        canMove,
        tryMove,
    };
}
