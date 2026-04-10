-- 期限切れルームを削除する関数
CREATE OR REPLACE FUNCTION cleanup_expired_rooms()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM rooms
  WHERE expires_at IS NOT NULL
    AND expires_at < now()
  RETURNING 1 INTO deleted_count;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- pg_cron で毎時実行（Supabase Cloud では pg_cron が利用可能）
-- 注意: pg_cron 拡張が有効でない場合はこの部分はスキップされる
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'cleanup-expired-rooms',
      '0 * * * *',  -- 毎時0分
      'SELECT cleanup_expired_rooms()'
    );
  END IF;
END;
$$;
